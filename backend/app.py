from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import paho.mqtt.client as mqtt
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pet_health.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

# MQTT setup
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Connected with result code {rc}")
    client.subscribe("pet/health")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload}")
    data = json.loads(msg.payload)
    new_reading = HealthReading(
        heart_rate=data['heart_rate'],
        temperature=data['temperature'],
        activity_level=data['activity_level'],
        pet_id=data['pet_id']
    )
    with app.app_context():
        db.session.add(new_reading)
        db.session.commit()
    print(f"Saved new reading for pet {data['pet_id']}")

mqtt_client = mqtt.Client(protocol=mqtt.MQTTv5)
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
    readings = HealthReading.query.filter_by(pet_id=pet_id).order_by(HealthReading.timestamp.desc()).limit(10).all()
    return jsonify([
        {
            "id": reading.id,
            "timestamp": reading.timestamp.isoformat(),
            "heart_rate": reading.heart_rate,
            "temperature": reading.temperature,
            "activity_level": reading.activity_level
        } for reading in readings
    ])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
