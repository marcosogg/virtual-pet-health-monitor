import random
import time
import json
import paho.mqtt.client as mqtt

class PetWearableDevice:
    def __init__(self, pet_id, broker_address="localhost", broker_port=1883):
        self.pet_id = pet_id
        self.client = mqtt.Client(client_id=f"pet_device_{pet_id}", protocol=mqtt.MQTTv5, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        self.client.on_connect = self.on_connect
        self.client.connect(broker_address, broker_port)

    def on_connect(self, client, userdata, flags, reason_code, properties):
        print(f"Connected with result code {reason_code}")

    def generate_reading(self):
        return {
            "pet_id": self.pet_id,
            "heart_rate": round(random.uniform(60, 120), 2),
            "temperature": round(random.uniform(37.5, 39.5), 2),
            "activity_level": round(random.uniform(0, 10), 2)
        }

    def send_reading(self):
        reading = self.generate_reading()
        self.client.publish("pet/health", json.dumps(reading))
        print(f"Sent reading: {reading}")

    def run(self, interval=60):
        self.client.loop_start()
        try:
            while True:
                self.send_reading()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("Stopping device...")
        finally:
            self.client.loop_stop()
            self.client.disconnect()

if __name__ == "__main__":
    device = PetWearableDevice(pet_id=1)
    device.run(interval=60)  # Sending readings every 5 seconds for testing
