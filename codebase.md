# start_system.py

```py
import subprocess
import time
import sys

def start_process(command):
    return subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

def main():
    # Start the main application
    app_process = start_process("python backend/app.py")
    print("Started main application")

    # Wait for a few seconds to ensure the main application is up and running
    time.sleep(5)

    # Start multiple simulated devices
    num_pets = 10  # Change this to the number of pets you want to simulate
    device_processes = []
    for pet_id in range(1, num_pets + 1):
        device_process = start_process(f"python simulated_device/device.py {pet_id}")
        device_processes.append(device_process)
        print(f"Started simulated device for Pet {pet_id}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping processes...")
        app_process.terminate()
        for device_process in device_processes:
            device_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
```

# requirements.txt

```txt
flask
flask_sqlalchemy
flask_cors
flask_migrate
paho-mqtt
pytz
```

# README.md

```md
# Virtual Pet Health Monitor

The Virtual Pet Health Monitor is a web application that allows pet owners to monitor their pet's health metrics in real-time. The application displays various health indicators and provides insights into the pet's well-being.

## Features

- Real-time monitoring of pet health metrics
- Dashboard displaying key health indicators
- Historical data visualization using charts
- Support for multiple pets
- Custom icon gallery (available in development environment)

## Health Metrics

The application tracks and displays the following health metrics for each pet:

1. Heart Rate (bpm)
2. Temperature (°C)
3. Activity Level
4. Respiratory Rate (breaths/min)
5. Hydration Level (%)
6. Sleep Duration (hours and minutes)
7. Hours Since Last Feeding

## Getting Started

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   \`\`\`
   cd frontend
   npm install
   \`\`\`
4. Start the development server:
   \`\`\`
   npm start
   \`\`\`
5. Open your browser and visit `http://localhost:3000`

## Custom Icon Gallery

In the development environment, you can access the custom icon gallery by visiting `http://localhost:3000/icon-gallery`. This gallery displays all available custom icons used in the application, making it easier for developers to reference and use these icons in their components.

## Running Tests

To run the unit tests for the frontend components:

\`\`\`
cd frontend
npm test
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
```

# package.json

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "socket.io-client": "^4.7.5"
  }
}

```

# add_pets.py

```py
from backend.app import app, db
from backend.app import Pet

def add_pets():
    pets = [
        Pet(name='Max', species='Dog', breed='Labrador Retriever', age=3.5, weight=30.2),
        Pet(name='Luna', species='Cat', breed='Siamese', age=2.0, weight=4.5),
        Pet(name='Charlie', species='Dog', breed='Golden Retriever', age=5.0, weight=32.1),
        Pet(name='Bella', species='Cat', breed='Maine Coon', age=4.5, weight=6.8),
        Pet(name='Rocky', species='Dog', breed='German Shepherd', age=2.5, weight=28.7)
    ]

    with app.app_context():
        db.session.add_all(pets)
        db.session.commit()
        print("5 pets have been added to the database.")

        all_pets = Pet.query.all()
        for pet in all_pets:
            print(f"ID: {pet.id}, Name: {pet.name}, Species: {pet.species}, Breed: {pet.breed}, Age: {pet.age}, Weight: {pet.weight}")

if __name__ == "__main__":
    add_pets()
```

# .gitignore

```
��v e n v /  
 * . p y c  
 f r o n t e n d / n o d e _ m o d u l e s /  
 * . s q l i t e  
 
```

# tests\test_app.py

```py

```

# simulated_device\device.py

```py
import random
import time
import json
import paho.mqtt.client as mqtt
from datetime import datetime
import pytz
import sys
import threading

class PetWearableDevice:
    def __init__(self, pet_id, broker_address="localhost", broker_port=1883):
        self.pet_id = pet_id
        self.client = mqtt.Client(client_id=f"pet_device_{pet_id}", protocol=mqtt.MQTTv5)
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        self.broker_address = broker_address
        self.broker_port = broker_port
        self.last_feeding_time = datetime.now(pytz.timezone('Europe/Dublin'))

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
        
        # Calculate time since last feeding
        time_since_feeding = current_time - self.last_feeding_time
        hours_since_feeding = time_since_feeding.total_seconds() / 3600

        # Simulate feeding every 8-12 hours
        if hours_since_feeding > random.uniform(8, 12):
            self.last_feeding_time = current_time

        return {
            "pet_id": self.pet_id,
            "heart_rate": round(random.uniform(60, 120), 2),
            "temperature": round(random.uniform(37.5, 39.5), 2),
            "activity_level": round(random.uniform(0, 10), 2),
            "respiratory_rate": round(random.uniform(15, 30), 2),
            "hydration_level": round(random.uniform(0, 100), 2),
            "sleep_duration": round(random.uniform(0, 12), 2),
            "latitude": round(random.uniform(53.3, 53.4), 6),
            "longitude": round(random.uniform(-6.3, -6.2), 6),
            "hours_since_feeding": round(hours_since_feeding, 2),
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

def run_device(pet_id, interval):
    device = PetWearableDevice(pet_id)
    device.run(interval)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python device.py <number_of_pets>")
        sys.exit(1)
    
    num_pets = int(sys.argv[1])
    threads = []
    
    for i in range(num_pets):
        thread = threading.Thread(target=run_device, args=(i+1, 10))
        threads.append(thread)
        thread.start()
    
    try:
        for thread in threads:
            thread.join()
    except KeyboardInterrupt:
        print("Stopping all devices...")

```

# frontend\tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e6f2ff',
          200: '#bde0ff',
          300: '#94cdff',
          400: '#6bb9ff',
          500: '#42a6ff',
          600: '#3182ce',
          700: '#2c5282',
          800: '#1e3a5c',
          900: '#102a43',
        },
        secondary: {
          100: '#e6f0ff',
          200: '#bfd9ff',
          300: '#99c2ff',
          400: '#73abff',
          500: '#4d94ff',
          600: '#3377cc',
          700: '#265a99',
          800: '#1a3d66',
          900: '#0d2033',
        },
        accent: {
          100: '#fff9e6',
          200: '#ffeeb3',
          300: '#ffe480',
          400: '#ffd94d',
          500: '#ffcd1a',
          600: '#ecc94b',
          700: '#d4a017',
          800: '#a67c00',
          900: '#785700',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

```

# frontend\README.md

```md
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```

# frontend\postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

# frontend\package.json

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@craco/craco": "^7.1.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.3",
    "mqtt": "^5.9.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^4.10.1",
    "react-router-dom": "^6.26.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.12.7",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```

# frontend\mqtt-client.js

```js
import mqtt from 'mqtt';

class MQTTClient {
  constructor() {
    this.client = null;
    this.status = 'disconnected';
  }

  connect() {
    this.client = mqtt.connect('ws://localhost:9001');  // Assuming MQTT broker is running on this port

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

```

# frontend\craco-config.js

```js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}

```

# frontend\.gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

```

# backend\models.py

```py

```

# backend\config.py

```py

```

# backend\app.py

```py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta, timezone
import paho.mqtt.client as mqtt
import json
import threading
import time
import pytz
from flask_socketio import SocketIO, emit
import logging
import os

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'pet_health.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", async_mode='threading', logger=True, engineio_logger=True)

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    breed = db.Column(db.String(50))
    age = db.Column(db.Float)
    weight = db.Column(db.Float)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    readings = db.relationship('HealthReading', backref='pet', lazy=True, cascade="all, delete-orphan")

class HealthReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.UTC))
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
    logger.info(f"MQTT client connected with result code {rc}")
    client.subscribe("pet/health")

def on_message(client, userdata, msg):
    logger.info(f"Received MQTT message: {msg.payload}")
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
        db.session.commit()
    logger.info(f"Saved new reading for pet {data['pet_id']}")
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
    pets = Pet.query.all()
    return jsonify([{
        "id": pet.id,
        "name": pet.name,
        "species": pet.species,
        "breed": pet.breed,
        "age": pet.age,
        "weight": pet.weight
    } for pet in pets])


@app.route('/pet', methods=['POST'])
def add_pet():
    data = request.json
    if not data or 'name' not in data or 'species' not in data:
        return jsonify({"error": "Invalid input. Name and species are required."}), 400
    try:
        new_pet = Pet(name=data['name'], species=data['species'])
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
        db.session.delete(pet)
        db.session.commit()
        return jsonify({"message": "Pet deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def handle_connect():
    logger.info(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f'Client disconnected: {request.sid}')

@socketio.on('error')
def handle_error(error):
    logger.error(f'SocketIO error: {error}')

@socketio.on('ping')
def handle_ping():
    logger.debug(f'Received ping from client: {request.sid}')
    emit('pong')

# Create database tables
with app.app_context():
    db.create_all()
    logger.info("Database tables created.")

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
```

# frontend\src\setupTests.js

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

# frontend\src\reportWebVitals.js

```js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

# frontend\src\placeholder.txt

```txt

```

# frontend\src\logo.svg

This is a file of the type: SVG Image

# frontend\src\index.js

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

# frontend\src\index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# frontend\src\dogcat.png

This is a binary file of the type: Image

# frontend\src\App.test.js

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

# frontend\src\App.js

```js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CustomIconGallery from './components/CustomIconGallery';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-32"> {/* Added mt-32 for top margin */}
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {isDevelopment && (
                <Route path="/icon-gallery" element={<CustomIconGallery />} />
              )}
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

```

# frontend\src\App.css

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

```

# frontend\public\robots.txt

```txt
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:

```

# frontend\public\manifest.json

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

```

# frontend\public\logo512.png

This is a binary file of the type: Image

# frontend\public\logo192.png

This is a binary file of the type: Image

# frontend\public\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3182ce" />
    <meta
      name="description"
      content="Virtual Pet Health Monitor - Track your pet's health and well-being"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
    <title>Virtual Pet Health Monitor</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

```

# frontend\public\favicon.ico

This is a binary file of the type: Binary

# backend\migrations\script.py.mako

```mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}

```

# backend\migrations\README

```
Single-database configuration for Flask.

```

# backend\migrations\env.py

```py
import logging
from logging.config import fileConfig

from flask import current_app

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')


def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine


def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace(
            '%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')


# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    conf_args = current_app.extensions['migrate'].configure_args
    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            **conf_args
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

```

# backend\migrations\alembic.ini

```ini
# A generic, single database configuration.

[alembic]
# template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false


# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic,flask_migrate

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[logger_flask_migrate]
level = INFO
handlers =
qualname = flask_migrate

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S

```

# backend\instance\pet_health.db

This is a binary file of the type: Binary

# frontend\src\services\mqttclient.js

```js
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

```

# frontend\src\services\api.js

```js
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000';
const socket = io(API_URL, {
  transports: ['polling'],
  forceNew: true,
  timeout: 10000,
});

export const addPet = (petData) => {
  console.log('Sending request to add pet:', petData);
  return axios.post(`${API_URL}/pet`, petData)
    .then(response => {
      console.log('Add pet response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error adding pet:', error);
      throw error;
    });
};

export const getPets = () => {
  console.log('Fetching all pets');
  return axios.get(`${API_URL}/pets`)
    .then(response => {
      console.log('Get pets response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error fetching pets:', error);
      throw error;
    });
};

export const deletePet = (petId) => {
  console.log('Deleting pet:', petId);
  return axios.delete(`${API_URL}/pet/${petId}`)
    .then(response => {
      console.log('Delete pet response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error deleting pet:', error);
      throw error;
    });
};

export const getPetReadings = (petId) => {
  console.log('Fetching readings for pet:', petId);
  return axios.get(`${API_URL}/pet/${petId}/readings`)
    .then(response => {
      console.log('Pet readings response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error fetching pet readings:', error);
      throw error;
    });
};

export const getPetHealthMetrics = (petId) => {
  console.log('Fetching health metrics for pet:', petId);
  return getPetReadings(petId)
    .then(response => {
      const readings = response.data;
      const latestReading = readings[readings.length - 1] || {};
      
      const healthMetrics = {
        heartRate: { name: 'Heart Rate', value: latestReading.heart_rate || 'N/A' },
        temperature: { name: 'Temperature', value: latestReading.temperature || 'N/A' },
        respirationRate: { name: 'Respiration Rate', value: latestReading.respiratory_rate || 'N/A' },
        activity: { name: 'Activity', value: calculateDailyActivity(readings) },
        sleepDuration: { name: 'Sleep Duration', value: calculateSleepDuration(readings) },
        waterIntake: { name: 'Water Intake', value: calculateWaterIntake(readings) },
      };

      console.log('Processed health metrics:', healthMetrics);
      return { data: healthMetrics };
    })
    .catch(error => {
      console.error('Error fetching pet health metrics:', error);
      throw error;
    });
};

function calculateDailyActivity(readings) {
  if (readings.length === 0) return 'N/A';
  const last24Hours = readings.slice(-24);
  const avgActivity = last24Hours.reduce((sum, reading) => sum + (reading.activity_level || 0), 0) / last24Hours.length;
  return Math.round(avgActivity * 10) / 10;
}

function calculateSleepDuration(readings) {
  if (readings.length === 0) return 'N/A';
  const last24Hours = readings.slice(-24);
  const sleepPeriods = last24Hours.filter(reading => (reading.activity_level || 0) < 20).length;
  return sleepPeriods / 2;
}

function calculateWaterIntake(readings) {
  if (readings.length === 0) return 'N/A';
  const last24Hours = readings.slice(-24);
  return last24Hours.reduce((sum, reading) => sum + (reading.hydration_level || 0), 0);
}

export const subscribeToNewReadings = (callback) => {
  socket.on('new_reading', (data) => {
    console.log('New reading received:', data);
    callback(data);
  });
};

export const unsubscribeFromNewReadings = () => {
  socket.off('new_reading');
};

// Add error and connection listeners for debugging
socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});

socket.on('connect', () => {
  console.log('Socket.IO connected successfully');
  // Start sending ping messages
  setInterval(() => {
    console.log('Sending ping to server');
    socket.emit('ping');
  }, 25000); // Send a ping every 25 seconds
});

socket.on('disconnect', (reason) => {
  console.log('Socket.IO disconnected:', reason);
});

socket.on('pong', () => {
  console.log('Received pong from server');
});

socket.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

// Reconnection logic
socket.io.on('reconnect_attempt', (attempt) => {
  console.log('Attempting to reconnect:', attempt);
});

socket.io.on('reconnect', (attempt) => {
  console.log('Reconnected after', attempt, 'attempts');
});

socket.io.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});

socket.io.on('reconnect_failed', () => {
  console.error('Failed to reconnect');
});

export const socketInstance = socket;

```

# frontend\src\components\UIComponents.js

```js
import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-bold rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? "border-red-500" : ""
        }`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
});

export const Select = React.forwardRef(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? "border-red-500" : ""
          }`}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
      </div>
    );
  }
);

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

export const Alert = ({ children, type = "info" }) => {
  const typeClasses = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  return (
    <div className={`border-l-4 p-4 ${typeClasses[type]}`} role="alert">
      {children}
    </div>
  );
};

export const Icon = ({ name, className = "", text = "" }) => {
  const icons = {
    heart: "❤️",
    thermometer: "🌡️",
    lung: "🫁",
    running: "🏃",
    moon: "🌙",
    droplet: "💧",
    dog: "🐕",
    cat: "🐈",
    food: "🍖",
    water: "💧",
    paw: "🐾",
    bell: "🔔",
    chart: "📊",
    calendar: "📅",
    pill: "💊",
    vaccine: "💉",
    stethoscope: "🩺",
    bone: "🦴",
    fish: "🐠",
    bird: "🐦",
    rabbit: "🐰",
    hamster: "🐹",
    turtle: "🐢",
    poop: "💩",
    leash: "🐕‍🦺",
    brush: "🧹",
    scissors: "✂️",
    bath: "🛁",
    toy: "🧸",
    bed: "🛏️",
    house: "🏠",
    park: "🏞️",
    vet: "👨‍⚕️",
    microscope: "🔬",
    "x-ray": "🦴",
    bandage: "🩹",
    weight: "⚖️",
    collar: "🔗",
    clock: "⏰",
    sun: "☀️",
    rain: "🌧️",
    snow: "❄️",
    hot: "🥵",
    cold: "🥶",
    flea: "🐜",
    tick: "🕷️",
    grooming: "💇",
    tooth: "🦷",
    ear: "👂",
    eye: "👁️",
    nose: "👃",
    "paw-print": "🐾",
    "first-aid-kit": "🧳",
    "pet-carrier": "🧳",
    "pet-food-bowl": "🥣",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2">{icons[name] || name}</span>
      {text && <span>{text}</span>}
    </div>
  );
};

export const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        {text}
        <svg
          className="absolute text-gray-800 h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
        >
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MetricCard = ({
  icon,
  label,
  value,
  unit,
  normalRange,
  timestamp,
  onViewDetails,
}) => {
  const getStatusColor = (value, normalRange) => {
    if (value === "N/A") return "text-gray-500";
    if (value < normalRange[0]) return "text-red-500";
    if (value > normalRange[1]) return "text-red-500";
    if (value === normalRange[0] || value === normalRange[1])
      return "text-yellow-500";
    return "text-green-500";
  };

  const isAbnormal = (value, normalRange) => {
    return value < normalRange[0] || value > normalRange[1];
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon name={icon} className="w-8 h-8 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500 capitalize">
              {label}
            </p>
            <p
              className={`text-2xl font-bold ${getStatusColor(
                value,
                normalRange
              )}`}
            >
              {value === "N/A" ? "N/A" : `${value} ${unit}`}
            </p>
          </div>
        </div>
        {isAbnormal(value, normalRange) && (
          <Tooltip text="This value is outside the normal range">
            <Icon name="bell" className="w-6 h-6 text-red-500" />
          </Tooltip>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        {/* <p>Last updated: {new Date(timestamp).toLocaleString()}</p> */}
        <Button size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export const Dropdown = ({ options, value, onChange, className = "" }) => {
  return (
    <select
      className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

```

# frontend\src\components\PetList.js

```js
import React from 'react';
import { Button } from './UIComponents';

function PetList({ pets, selectedPetId, onSelectPet, onDeletePet }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-primary-dark font-serif">Your Pets</h2>
      {pets.length > 0 ? (
        <ul className="space-y-2" role="list" aria-label="List of pets">
          {pets.map(pet => (
            <li key={pet.id} className="flex items-center justify-between">
              <button
                className={`flex-grow text-left px-4 py-2 rounded transition ${
                  pet.id === selectedPetId 
                    ? 'bg-primary-light text-primary-dark' 
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                }`}
                onClick={() => onSelectPet(pet.id)}
                aria-pressed={pet.id === selectedPetId}
                aria-label={`Select ${pet.name}`}
              >
                {pet.name} ({pet.species})
              </button>
              <Button
                onClick={() => onDeletePet(pet.id)}
                variant="danger"
                size="sm"
                className="ml-2"
                aria-label={`Delete ${pet.name}`}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500" role="status">No pets added yet.</p>
      )}
    </div>
  );
}

export default PetList;

```

# frontend\src\components\PetDetails.test.js

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import PetDetails from './PetDetails';
import { getPetReadings } from '../services/api';

jest.mock('../services/api');

const mockReading = {
  timestamp: '2023-09-01T12:00:00Z',
  heart_rate: 80,
  temperature: 38.5,
  activity_level: 7,
  respiratory_rate: 20,
  hydration_level: 70,
  sleep_duration: 360,
  hours_since_feeding: 4.5
};

describe('PetDetails', () => {
  beforeEach(() => {
    getPetReadings.mockResolvedValue({ data: [mockReading] });
  });

  it('renders new metrics correctly', async () => {
    render(<PetDetails petId={1} />);

    // Wait for the component to load data
    await screen.findByText(/Latest Reading/i);

    // Check if new metrics are displayed
    expect(screen.getByText(/Sleep Duration: 6h 0m/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours Since Feeding: 4.5 hours/i)).toBeInTheDocument();
  });

  it('displays N/A for missing data', async () => {
    const incompleteReading = { ...mockReading, sleep_duration: null, hours_since_feeding: undefined };
    getPetReadings.mockResolvedValue({ data: [incompleteReading] });

    render(<PetDetails petId={1} />);

    // Wait for the component to load data
    await screen.findByText(/Latest Reading/i);

    // Check if N/A is displayed for missing data
    expect(screen.getByText(/Sleep Duration: N\/A/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours Since Feeding: N\/A/i)).toBeInTheDocument();
  });
});
```

# frontend\src\components\PetDetails.js

```js
import React, { useState, useEffect, useMemo } from 'react';
import { getPetReadings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaMoon, FaUtensils } from 'react-icons/fa';
import { Card, LoadingSpinner, Alert } from './UIComponents';

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-white p-4 shadow-lg">
        <p className="text-primary-600 font-bold">{`Time: ${new Date(label).toLocaleString()}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-700" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} ${entry.unit || ''}`}
          </p>
        ))}
      </Card>
    );
  }
  return null;
});

const formatSleepDuration = (minutes) => {
  if (minutes === undefined || minutes === null) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatHoursSinceFeeding = (hours) => {
  if (hours === undefined || hours === null) return 'N/A';
  return `${hours.toFixed(1)} hours`;
};

const PetDetails = React.memo(({ petId }) => {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      setIsLoading(true);
      try {
        const response = await getPetReadings(petId);
        setReadings(response.data);
      } catch (error) {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReadings();
    const interval = setInterval(fetchReadings, 10000); // Fetch every 10 seconds
  
    return () => clearInterval(interval);
  }, [petId]);

  const latestReading = useMemo(() => readings[0] || {}, [readings]);

  const chartData = useMemo(() => {
    return readings.map(reading => ({
      ...reading,
      timestamp: new Date(reading.timestamp).toLocaleTimeString(),
    }));
  }, [readings]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-serif font-semibold mb-4 text-primary-600">Pet Health Readings</h2>
      {readings.length > 0 ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <Card className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-2 text-secondary-600">Latest Reading</h3>
              <p className="text-gray-700">Timestamp: {new Date(latestReading.timestamp).toLocaleString()}</p>
              <p className="text-gray-700">Heart Rate: {latestReading.heart_rate} bpm</p>
              <p className="text-gray-700">Temperature: {latestReading.temperature}°C</p>
              <p className="text-gray-700">Activity Level: {latestReading.activity_level}</p>
              <p className="text-gray-700">Respiratory Rate: {latestReading.respiratory_rate} breaths/min</p>
              <p className="text-gray-700">Hydration Level: {latestReading.hydration_level}%</p>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-2 text-secondary-600">New Metrics</h3>
              <div className="flex items-center mb-2">
                <FaMoon className="mr-2 text-primary-500" />
                <p className="text-gray-700">Sleep Duration: {formatSleepDuration(latestReading.sleep_duration)}</p>
              </div>
              <div className="flex items-center">
                <FaUtensils className="mr-2 text-secondary-500" />
                <p className="text-gray-700">Hours Since Feeding: {formatHoursSinceFeeding(latestReading.hours_since_feeding)}</p>
              </div>
            </Card>
          </div>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Heart Rate and Temperature</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="#3182ce" name="Heart Rate" unit="bpm" />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#48bb78" name="Temperature" unit="°C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Activity and Hydration Levels</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="activity_level" stackId="1" stroke="#3182ce" fill="#63b3ed" name="Activity Level" />
                  <Area type="monotone" dataKey="hydration_level" stackId="2" stroke="#48bb78" fill="#9ae6b4" name="Hydration Level" unit="%" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Sleep Duration and Feeding</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sleep_duration" stroke="#3182ce" name="Sleep Duration" unit=" minutes" />
                  <Line yAxisId="right" type="monotone" dataKey="hours_since_feeding" stroke="#48bb78" name="Hours Since Feeding" unit=" hours" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : (
        <Alert type="info">No readings available</Alert>
      )}
    </Card>
  );
});

export default PetDetails;

```

# frontend\src\components\LoadingSpinner.js

```js
import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default LoadingSpinner;

```

# frontend\src\components\Header.js

```js
import React from 'react';
import dogCatLogo from '../dogcat.png';

function Header() {
  return (
    <header className="bg-primary-700 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-end">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Virtual Pet Health Monitor</h1>
          <p className="text-primary-200 mt-2">Keeping your pets healthy and happy!</p>
        </div>
        <div className="flex items-end">
          <img 
            src={dogCatLogo} 
            alt="Dog and cat logo" 
            className="h-24 w-auto object-contain mb-[-1rem]"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;

```

# frontend\src\components\Footer.js

```js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-primary-800 text-white py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} Virtual Pet Health Monitor. All rights reserved.
        </p>
        <p className="text-center text-xs mt-2 text-primary-200">
          Created for HDIP Computer Science 2023 - Networking using Connected Devices
        </p>
      </div>
    </footer>
  );
}

export default Footer;

```

# frontend\src\components\ErrorBoundary.js

```js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Oops! Something went wrong.</p>
          <p>We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

```

# frontend\src\components\Dashboard.js

```js
import React, { useState, useEffect, useCallback } from "react";
import {
  getPets,
  getPetHealthMetrics,
  deletePet,
  subscribeToNewReadings,
  unsubscribeFromNewReadings,
} from "../services/api";
import PetList from "./PetList";
import AddPetForm from "./AddPetForm";
import {
  Card,
  Alert,
  Button,
  Modal,
  MetricCard,
} from "./UIComponents";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [detailMetric, setDetailMetric] = useState(null);

  const fetchPets = useCallback(async () => {
    try {
      const response = await getPets();
      setPets(response.data);
      if (response.data.length > 0 && !selectedPetId) {
        setSelectedPetId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      setError("Failed to fetch pets. Please try again.");
    }
  }, [selectedPetId]);

  const handleNewReading = useCallback(
    (data) => {
      if (data.pet_id === selectedPetId) {
        fetchHealthMetrics(selectedPetId);
      }
    },
    [selectedPetId]
  );

  useEffect(() => {
    fetchPets();
    subscribeToNewReadings(handleNewReading);
    return () => {
      unsubscribeFromNewReadings();
    };
  }, [fetchPets, handleNewReading]);

  useEffect(() => {
    if (selectedPetId) {
      fetchHealthMetrics(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchHealthMetrics = async (petId) => {
    try {
      const response = await getPetHealthMetrics(petId);
      console.log("API Response:", response.data); // Add this line
      setHealthMetrics(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      setError("Failed to fetch health metrics. Please try again.");
      setHealthMetrics(null);
    }
  };

  const handleDeletePet = (petId) => {
    setDeletingPetId(petId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePet = async () => {
    try {
      await deletePet(deletingPetId);
      setShowDeleteConfirmation(false);
      setDeletingPetId(null);
      fetchPets();
      if (selectedPetId === deletingPetId) {
        setSelectedPetId(null);
        setHealthMetrics(null);
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError("Failed to delete pet. Please try again.");
    }
  };

  const calculateHealthScore = (metrics) => {
    let totalScore = 0;
    let availableMetrics = 0;

    const normalRanges = {
      heartRate: [60, 100],
      temperature: [38, 39.2],
      respirationRate: [15, 30],
      activity: [4, 8],
      sleepDuration: [12, 14],
      waterIntake: [20, 70],
    };

    for (const [key, metric] of Object.entries(metrics)) {
      if (metric.value !== "N/A" && !isNaN(parseFloat(metric.value))) {
        const value = parseFloat(metric.value);
        const range = normalRanges[key];

        availableMetrics++;

        if (value >= range[0] && value <= range[1]) {
          totalScore += 100;
        } else {
          const midpoint = (range[0] + range[1]) / 2;
          const maxDeviation = Math.max(
            Math.abs(range[1] - midpoint),
            Math.abs(range[0] - midpoint)
          );
          const deviation = Math.abs(value - midpoint);
          const partialScore = Math.max(
            0,
            (1 - deviation / maxDeviation) * 100
          );
          totalScore += partialScore;
        }
      }
    }

    if (availableMetrics === 0) return "N/A";
    return Math.round(totalScore / availableMetrics);
  };

  const getSelectedPet = () => {
    return pets.find((pet) => pet.id === selectedPetId) || {};
  };

  const renderHealthScoreTooltip = () => (
    <div className="bg-white p-2 rounded shadow-md">
      <p>
        The overall health score is calculated based on the pet's vital signs
        and daily activities.
      </p>
      <p>
        A score of 100 indicates optimal health, while lower scores suggest
        areas that may need attention.
      </p>
    </div>
  );

  const formatValue = (value) => {
    if (typeof value === "number") {
      return Number(value.toFixed(2));
    }
    return value;
  };

  const renderMetricDetails = () => (
    <Modal
      isOpen={!!detailMetric}
      onClose={() => setDetailMetric(null)}
      title={`${detailMetric?.label} Details`}
    >
      {detailMetric && (
        <>
          <p>
            Current value: {formatValue(detailMetric.value)} {detailMetric.unit}
          </p>
          <p>
            Normal range: {detailMetric.normalRange[0]} -{" "}
            {detailMetric.normalRange[1]} {detailMetric.unit}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={detailMetric.history}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </Modal>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-1">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Your Pets</h3>
          <PetList
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            onDeletePet={handleDeletePet}
          />
          <Button
            onClick={() => setShowAddPetModal(true)}
            className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Add New Pet
          </Button>
        </Card>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        {error && <Alert type="error">{error}</Alert>}
        {healthMetrics ? (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Pet Health Dashboard</h2>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Overall Health Score
                  </h3>
                  <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto relative group">
                    <span className="text-3xl font-bold text-white">
                      {calculateHealthScore(healthMetrics)}
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      {renderHealthScoreTooltip()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  icon="heart"
                  label="Heart Rate"
                  value={formatValue(healthMetrics.heartRate.value)}
                  unit="bpm"
                  normalRange={[60, 100]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.heartRate,
                      label: "Heart Rate",
                      unit: "bpm",
                      normalRange: [60, 100],
                    })
                  }
                />
                <MetricCard
                  icon="thermometer"
                  label="Temperature"
                  value={formatValue(healthMetrics.temperature.value)}
                  unit="°C"
                  normalRange={[38, 39.2]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.temperature,
                      label: "Temperature",
                      unit: "°C",
                      normalRange: [38, 39.2],
                    })
                  }
                />
                <MetricCard
                  icon="lung"
                  label="Respiration Rate"
                  value={formatValue(healthMetrics.respirationRate.value)}
                  unit="bpm"
                  normalRange={[15, 30]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.respirationRate,
                      label: "Respiration Rate",
                      unit: "bpm",
                      normalRange: [15, 30],
                    })
                  }
                />
                <MetricCard
                  icon="running"
                  label="Activity"
                  value={formatValue(healthMetrics.activity.value)}
                  unit="hours"
                  normalRange={[4, 8]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.activity,
                      label: "Activity",
                      unit: "hours",
                      normalRange: [4, 8],
                    })
                  }
                />
                <MetricCard
                  icon="moon"
                  label="Sleep Duration"
                  value={formatValue(healthMetrics.sleepDuration.value)}
                  unit="hours"
                  normalRange={[12, 14]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.sleepDuration,
                      label: "Sleep Duration",
                      unit: "hours",
                      normalRange: [12, 14],
                    })
                  }
                />
                <MetricCard
                  icon="droplet"
                  label="Water Intake"
                  value={formatValue(healthMetrics.waterIntake.value)}
                  unit="ml/kg"
                  normalRange={[20, 70]}
                  onViewDetails={() =>
                    setDetailMetric({
                      ...healthMetrics.waterIntake,
                      label: "Water Intake",
                      unit: "ml/kg",
                      normalRange: [20, 70],
                    })
                  }
                />
              </div>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold mb-4">Pet Information</h3>
              <p>
                <strong>Name:</strong> {getSelectedPet().name}
              </p>
              <p>
                <strong>Species:</strong> {getSelectedPet().species}
              </p>
              <p>
                <strong>Age:</strong> {getSelectedPet().age} years
              </p>
              <p>
                <strong>Breed:</strong> {getSelectedPet().breed}
              </p>
              <p>
                <strong>Weight:</strong> {getSelectedPet().weight} kg
              </p>
            </Card>
          </div>
        ) : (
          <Card>
            <p className="text-gray-500">Select a pet to view health metrics</p>
          </Card>
        )}
      </div>
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this pet?</p>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={confirmDeletePet} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        title="Add New Pet"
      >
        <AddPetForm
          onPetAdded={() => {
            fetchPets();
            setShowAddPetModal(false);
          }}
        />
      </Modal>
      {renderMetricDetails()}
    </div>
  );
};

export default Dashboard;

```

# frontend\src\components\CustomIconGallery.test.js

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomIconGallery from './CustomIconGallery';

describe('CustomIconGallery', () => {
  test('renders all custom icons with their names', () => {
    render(<CustomIconGallery />);

    // Check if the title is rendered
    expect(screen.getByText('Custom Icon Gallery')).toBeInTheDocument();

    // Check if all icon names are rendered
    const iconNames = [
      'heart', 'thermometer', 'lung', 'running', 'moon', 'droplet',
      'dog', 'cat', 'food', 'water', 'paw', 'bell', 'chart', 'calendar', 'pill',
      // Add more icon names here to match the ones you added in UIComponents.js
    ];
    iconNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    // Check if all SVG icons are rendered
    const svgIcons = screen.getAllByRole('img', { hidden: true });
    expect(svgIcons).toHaveLength(iconNames.length);
  });
});
```

# frontend\src\components\CustomIconGallery.js

```js
import React from 'react';

const CustomIconGallery = () => {
  const icons = [
    { name: 'heart', icon: '❤️' },
    { name: 'thermometer', icon: '🌡️' },
    { name: 'lung', icon: '🫁' },
    { name: 'running', icon: '🏃' },
    { name: 'moon', icon: '🌙' },
    { name: 'droplet', icon: '💧' },
    { name: 'dog', icon: '🐕' },
    { name: 'cat', icon: '🐈' },
    { name: 'food', icon: '🍖' },
    { name: 'water', icon: '💧' },
    { name: 'paw', icon: '🐾' },
    { name: 'bell', icon: '🔔' },
    { name: 'chart', icon: '📊' },
    { name: 'calendar', icon: '📅' },
    { name: 'pill', icon: '💊' },
    { name: 'vaccine', icon: '💉' },
    { name: 'stethoscope', icon: '🩺' },
    { name: 'bone', icon: '🦴' },
    { name: 'fish', icon: '🐠' },
    { name: 'bird', icon: '🐦' },
    { name: 'rabbit', icon: '🐰' },
    { name: 'hamster', icon: '🐹' },
    { name: 'turtle', icon: '🐢' },
    { name: 'poop', icon: '💩' },
    { name: 'leash', icon: '🐕‍🦺' },
    { name: 'brush', icon: '🧹' },
    { name: 'scissors', icon: '✂️' },
    { name: 'bath', icon: '🛁' },
    { name: 'toy', icon: '🧸' },
    { name: 'bed', icon: '🛏️' },
    { name: 'house', icon: '🏠' },
    { name: 'park', icon: '🏞️' },
    { name: 'vet', icon: '👨‍⚕️' },
    { name: 'microscope', icon: '🔬' },
    { name: 'x-ray', icon: '🦴' },
    { name: 'bandage', icon: '🩹' },
    { name: 'weight', icon: '⚖️' },
    { name: 'collar', icon: '🔗' },
    { name: 'clock', icon: '⏰' },
    { name: 'sun', icon: '☀️' },
    { name: 'rain', icon: '🌧️' },
    { name: 'snow', icon: '❄️' },
    { name: 'hot', icon: '🥵' },
    { name: 'cold', icon: '🥶' },
    { name: 'flea', icon: '🐜' },
    { name: 'tick', icon: '🕷️' },
    { name: 'grooming', icon: '💇' },
    { name: 'tooth', icon: '🦷' },
    { name: 'ear', icon: '👂' },
    { name: 'eye', icon: '👁️' },
    { name: 'nose', icon: '👃' },
    { name: 'paw-print', icon: '🐾' },
    { name: 'first-aid-kit', icon: '🧳' },
    { name: 'pet-carrier', icon: '🧳' },
    { name: 'pet-food-bowl', icon: '🥣' },
  ];

  return (
    <div className="custom-icon-gallery">
      <h2>Custom Icon Gallery</h2>
      <div className="icon-grid">
        {icons.map((icon, index) => (
          <div key={index} className="icon-item">
            <span className="icon">{icon.icon}</span>
            <span className="icon-name">{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomIconGallery;
```

# frontend\src\components\AddPetForm.js

```js
import React, { useState } from "react";
import { addPet } from "../services/api";
import { Button, Input, Select } from "./UIComponents";

function AddPetForm({ onPetAdded }) {
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPet(petData);
      setPetData({
        name: "",
        species: "",
        breed: "",
        age: "",
        weight: "",
      });
      onPetAdded();
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Pet Name"
        id="name"
        name="name"
        value={petData.name}
        onChange={handleChange}
        required
      />
      <Select
        label="Species"
        id="species"
        name="species"
        value={petData.species}
        onChange={handleChange}
        required
        options={[
          { value: "", label: "Select a species" },
          { value: "Dog", label: "Dog" },
          { value: "Cat", label: "Cat" },
          { value: "Other", label: "Other" },
        ]}
      />
      <Input
        label="Breed"
        id="breed"
        name="breed"
        value={petData.breed}
        onChange={handleChange}
      />
      <Input
        label="Age (years)"
        id="age"
        name="age"
        type="number"
        value={petData.age}
        onChange={handleChange}
        min="0"
        step="0.1"
      />
      <Input
        label="Weight (kg)"
        id="weight"
        name="weight"
        type="number"
        value={petData.weight}
        onChange={handleChange}
        min="0"
        step="0.1"
      />
      <Button type="submit">Add Pet</Button>
    </form>
  );
}

export default AddPetForm;

```

