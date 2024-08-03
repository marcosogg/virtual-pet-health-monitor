# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}


```

# README.md

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

# postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

# package.json

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
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

# .gitignore

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

# public\robots.txt

```txt
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:

```

# public\manifest.json

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

# public\logo512.png

This is a binary file of the type: Image

# public\logo192.png

This is a binary file of the type: Image

# public\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>

```

# public\favicon.ico

This is a binary file of the type: Binary

# src\setupTests.js

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

# src\reportWebVitals.js

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

# src\placeholder.txt

```txt

```

# src\logo.svg

This is a file of the type: SVG Image

# src\index.js

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

# src\index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# src\App.test.js

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

# src\App.js

```js
import React, { useState, useEffect } from 'react';
import { getPets } from './services/api';
import Header from './components/Header';
import PetList from './components/PetList';
import AddPetForm from './components/AddPetForm';
import PetDetails from './components/PetDetails';

function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await getPets();
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to fetch pets. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <AddPetForm onPetAdded={fetchPets} />
            <PetList 
              pets={pets} 
              selectedPetId={selectedPetId} 
              onSelectPet={setSelectedPetId} 
            />
          </div>
          <div className="md:col-span-2">
            {selectedPetId ? (
              <PetDetails petId={selectedPetId} />
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">Select a pet to view details</p>
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}

export default App;

```

# src\App.css

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

# src\components\PetList.js

```js
import React from 'react';

function PetList({ pets, selectedPetId, onSelectPet }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Your Pets</h2>
      <ul className="space-y-2">
        {pets.map(pet => (
          <li key={pet.id}>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                pet.id === selectedPetId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectPet(pet.id)}
            >
              {pet.name} ({pet.species})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PetList;

```

# src\components\PetDetails.js

```js
import React, { useState, useEffect } from 'react';
import { getPetReadings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PetDetails({ petId }) {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await getPetReadings(petId);
        setReadings(response.data);
      } catch (error) {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings. Please try again.');
      }
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 60000); // Fetch every minute

    return () => clearInterval(interval);
  }, [petId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Pet Health Readings</h2>
      {readings.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Latest Reading</h3>
            <p>Timestamp: {new Date(readings[0].timestamp).toLocaleString()}</p>
            <p>Heart Rate: {readings[0].heart_rate} bpm</p>
            <p>Temperature: {readings[0].temperature}°C</p>
            <p>Activity Level: {readings[0].activity_level}</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="#8884d8" name="Heart Rate (bpm)" />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="activity_level" stroke="#ffc658" name="Activity Level" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No readings available</p>
      )}
    </div>
  );
}

export default PetDetails;

```

# src\components\Header.js

```js
import React from 'react';

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Virtual Pet Health Monitor</h1>
      </div>
    </header>
  );
}

export default Header;

```

# src\components\AddPetForm.js

```js
import React, { useState } from 'react';
import { addPet } from '../services/api';

function AddPetForm({ onPetAdded }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPet({ name, species });
      setName('');
      setSpecies('');
      onPetAdded();
    } catch (error) {
      console.error('Error adding pet:', error);
      setError('Failed to add pet. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Pet</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pet Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="species" className="block text-sm font-medium text-gray-700">Pet Species</label>
          <input
            type="text"
            id="species"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Add Pet
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default AddPetForm;

```

# src\services\api.js

```js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

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

```

