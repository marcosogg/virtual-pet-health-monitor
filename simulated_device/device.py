import random
import time
import json
import paho.mqtt.client as mqtt
from datetime import datetime
import pytz
import sys

class PetWearableDevice:
    def __init__(self, pet_id, broker_address="localhost", broker_port=1883):
        self.pet_id = pet_id
        self.client = mqtt.Client(client_id=f"pet_device_{pet_id}", protocol=mqtt.MQTTv5)
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        self.broker_address = broker_address
        self.broker_port = broker_port

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            print(f"Connected successfully to MQTT broker for pet {self.pet_id}")
        else:
            print(f"Failed to connect to MQTT broker for pet {self.pet_id}. Error code: {rc}")

    def on_publish(self, client, userdata, mid):
        print(f"Message {mid} published successfully for pet {self.pet_id}")

    def generate_reading(self):
        dublin_tz = pytz.timezone('Europe/Dublin')
        current_time = datetime.now(dublin_tz)
        return {
            "pet_id": self.pet_id,
            "heart_rate": round(random.uniform(60, 120), 2),
            "temperature": round(random.uniform(37.5, 39.5), 2),
            "activity_level": round(random.uniform(0, 10), 2),
            "latitude": round(random.uniform(53.3, 53.4), 6),  # Dublin latitude range
            "longitude": round(random.uniform(-6.3, -6.2), 6),  # Dublin longitude range
            "timestamp": current_time.isoformat()
        }


    def send_reading(self):
        reading = self.generate_reading()
        payload = json.dumps(reading)
        result = self.client.publish("pet/health", payload)
        if result.rc != 0:
            print(f"Failed to send reading for pet {self.pet_id}. Error code: {result.rc}")
        else:
            print(f"Sent reading for pet {self.pet_id}: {reading}")

    def run(self, interval=60):
        try:
            self.client.connect(self.broker_address, self.broker_port)
            self.client.loop_start()
            while True:
                self.send_reading()
                time.sleep(interval)
        except KeyboardInterrupt:
            print(f"Stopping device for pet {self.pet_id}...")
        except Exception as e:
            print(f"Error in device for pet {self.pet_id}: {str(e)}")
        finally:
            self.client.loop_stop()
            self.client.disconnect()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python device.py <pet_id>")
        sys.exit(1)
    
    pet_id = int(sys.argv[1])
    device = PetWearableDevice(pet_id)
    device.run(interval=10)  # Sending readings every 10 seconds for testing
