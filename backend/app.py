from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import paho.mqtt.client as mqtt
import json
import threading
import time
import pytz

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pet_health.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Models
class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    readings = db.relationship('HealthReading', backref='pet', lazy=True)

class HealthReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    heart_rate = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

# Data processing
def smooth_data(data, window_size=3):
    return [sum(data[i:i+window_size])/window_size for i in range(len(data)-window_size+1)]

# MQTT setup
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Connected with result code {rc}")
    client.subscribe("pet/health")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload}")
    data = json.loads(msg.payload)
    dublin_tz = pytz.timezone('Europe/Dublin')
    timestamp = datetime.fromisoformat(data['timestamp']).astimezone(pytz.UTC)
    new_reading = HealthReading(
        heart_rate=data['heart_rate'],
        temperature=data['temperature'],
        activity_level=data['activity_level'],
        latitude=data['latitude'],  # Make sure this line is present
        longitude=data['longitude'],  # Make sure this line is present
        pet_id=data['pet_id'],
        timestamp=timestamp
    )
    with app.app_context():
        db.session.add(new_reading)
        db.session.commit()
    print(f"Saved new reading for pet {data['pet_id']}")

mqtt_client = mqtt.Client(protocol=mqtt.MQTTv5, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect("localhost", 1883, 60)
mqtt_client.loop_start()

# Routes
@app.route('/pet', methods=['POST'])
def add_pet():
    data = request.json
    new_pet = Pet(name=data['name'], species=data['species'])
    db.session.add(new_pet)
    db.session.commit()
    print(f"Added new pet: {new_pet.name} (ID: {new_pet.id})")
    return jsonify({"message": "Pet added successfully", "pet_id": new_pet.id, "name": new_pet.name}), 201

@app.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([{"id": pet.id, "name": pet.name, "species": pet.species} for pet in pets])

@app.route('/pet/<int:pet_id>/readings', methods=['GET'])
def get_pet_readings(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    readings = HealthReading.query.filter_by(pet_id=pet_id).order_by(HealthReading.timestamp.desc()).limit(100).all()
    
    heart_rates = [r.heart_rate for r in readings]
    temperatures = [r.temperature for r in readings]
    activity_levels = [r.activity_level for r in readings]
    
    smoothed_heart_rates = smooth_data(heart_rates)
    smoothed_temperatures = smooth_data(temperatures)
    smoothed_activity_levels = smooth_data(activity_levels)
    
    dublin_tz = pytz.timezone('Europe/Dublin')
    
    return jsonify([
        {
            "id": reading.id,
            "timestamp": reading.timestamp.replace(tzinfo=pytz.UTC).astimezone(dublin_tz).isoformat(),
            "heart_rate": reading.heart_rate,
            "temperature": reading.temperature,
            "activity_level": reading.activity_level,
            "latitude": reading.latitude,
            "longitude": reading.longitude,
            "smoothed_heart_rate": smoothed_heart_rates[i] if i < len(smoothed_heart_rates) else None,
            "smoothed_temperature": smoothed_temperatures[i] if i < len(smoothed_temperatures) else None,
            "smoothed_activity_level": smoothed_activity_levels[i] if i < len(smoothed_activity_levels) else None
        } for i, reading in enumerate(readings)
    ])

def cleanup_old_data():
    while True:
        with app.app_context():
            one_month_ago = datetime.now(pytz.UTC) - timedelta(days=30)
            old_readings = HealthReading.query.filter(HealthReading.timestamp < one_month_ago).all()
            for reading in old_readings:
                db.session.delete(reading)
            db.session.commit()
        time.sleep(86400)  # Run once a day

cleanup_thread = threading.Thread(target=cleanup_old_data)
cleanup_thread.start()

if __name__ == '__main__':
    app.run(debug=True)
