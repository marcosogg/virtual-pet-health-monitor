import mqtt from 'mqtt';

class MQTTClient {
  constructor() {
    this.client = null;
    this.status = 'disconnected';
  }

  connect() {
    // Use WebSocket connection for browser compatibility
    this.client = mqtt.connect('ws://localhost:9001');

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.status = 'connected';
      this.client.subscribe('pet/health');
    });

    this.client.on('message', (topic, message) => {
      console.log('Received message:', message.toString());
      // Handle incoming messages here
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
      this.status = 'error';
    });

    this.client.on('close', () => {
      console.log('Disconnected from MQTT broker');
      this.status = 'disconnected';
    });
  }

  getStatus() {
    return this.status;
  }
}

export default new MQTTClient();
