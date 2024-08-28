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
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pet_health.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    readings = db.relationship('HealthReading', backref='pet', lazy=True, cascade="all, delete-orphan")

class HealthReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    heart_rate = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.Float, nullable=False)
    respiratory_rate = db.Column(db.Float, nullable=False)
    hydration_level = db.Column(db.Float, nullable=False)
    sleep_duration = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    hours_since_feeding = db.Column(db.Float, nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

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
        respiratory_rate=data['respiratory_rate'],
        hydration_level=data['hydration_level'],
        sleep_duration=data['sleep_duration'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        hours_since_feeding=data['hours_since_feeding'],
        pet_id=data['pet_id'],
        timestamp=timestamp
    )
    with app.app_context():
        db.session.add(new_reading)
        pet = Pet.query.get(data['pet_id'])
        if pet:
            pet.last_activity = timestamp
            pet.is_active = True
        db.session.commit()
    print(f"Saved new reading for pet {data['pet_id']}")
    socketio.emit('new_reading', data)

mqtt_client = mqtt.Client(protocol=mqtt.MQTTv5, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect("localhost", 1883, 60)
mqtt_client.loop_start()

@app.route('/pet/<int:pet_id>/readings', methods=['GET'])
def get_pet_readings(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    readings = HealthReading.query.filter_by(pet_id=pet_id).order_by(HealthReading.timestamp.desc()).limit(100).all()
    
    dublin_tz = pytz.timezone('Europe/Dublin')
    
    return jsonify([
        {
            "id": reading.id,
            "timestamp": reading.timestamp.replace(tzinfo=pytz.UTC).astimezone(dublin_tz).isoformat(),
            "heart_rate": reading.heart_rate,
            "temperature": reading.temperature,
            "activity_level": reading.activity_level,
            "respiratory_rate": reading.respiratory_rate,
            "hydration_level": reading.hydration_level,
            "sleep_duration": reading.sleep_duration,
            "latitude": reading.latitude,
            "longitude": reading.longitude,
            "hours_since_feeding": reading.hours_since_feeding
        } for reading in readings
    ])

@app.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.filter_by(is_active=True).all()
    return jsonify([{"id": pet.id, "name": pet.name, "species": pet.species} for pet in pets])

@app.route('/pet', methods=['POST'])
def add_pet():
    data = request.json
    if not data or 'name' not in data or 'species' not in data:
        return jsonify({"error": "Invalid input. Name and species are required."}), 400
    try:
        new_pet = Pet(name=data['name'], species=data['species'], is_active=True)
        db.session.add(new_pet)
        db.session.commit()
        return jsonify({"message": "Pet added successfully", "pet_id": new_pet.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/pet/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    try:
        pet.is_active = False
        db.session.commit()
        return jsonify({"message": "Pet marked as inactive successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def clean_inactive_pets():
    while True:
        with app.app_context():
            inactive_threshold = datetime.utcnow() - timedelta(hours=24)
            inactive_pets = Pet.query.filter(Pet.last_activity < inactive_threshold).all()
            for pet in inactive_pets:
                pet.is_active = False
            db.session.commit()
        time.sleep(3600)  # Run every hour

cleaning_thread = threading.Thread(target=clean_inactive_pets)
cleaning_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)
