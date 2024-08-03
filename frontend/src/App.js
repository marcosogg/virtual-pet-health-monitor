import React, { useState, useEffect } from 'react';
import { addPet, getPets, getPetReadings } from './services/api';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [readings, setReadings] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [error, setError] = useState(null);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState('');

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

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const response = await addPet({ name: newPetName, species: newPetSpecies });
      console.log('Pet added:', response.data);
      setNewPetName('');
      setNewPetSpecies('');
      fetchPets();
    } catch (error) {
      console.error('Error adding pet:', error);
      setError('Failed to add pet. Please try again.');
    }
  };

  useEffect(() => {
    const fetchReadings = async () => {
      if (selectedPetId) {
        try {
          const response = await getPetReadings(selectedPetId);
          setReadings(response.data);
        } catch (error) {
          console.error('Error fetching readings:', error);
          setError('Failed to fetch readings. Please try again.');
        }
      }
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 60000); // Fetch every minute

    return () => clearInterval(interval);
  }, [selectedPetId]);

  return (
    <div className="App">
      <h1>Virtual Pet Health Monitor</h1>
      <form onSubmit={handleAddPet}>
        <input
          type="text"
          value={newPetName}
          onChange={(e) => setNewPetName(e.target.value)}
          placeholder="Pet Name"
          required
        />
        <input
          type="text"
          value={newPetSpecies}
          onChange={(e) => setNewPetSpecies(e.target.value)}
          placeholder="Pet Species"
          required
        />
        <button type="submit">Add Pet</button>
      </form>
      <select onChange={(e) => setSelectedPetId(e.target.value)}>
        <option value="">Select a pet</option>
        {pets.map(pet => (
          <option key={pet.id} value={pet.id}>{pet.name} ({pet.species})</option>
        ))}
      </select>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div>
        <h2>Latest Readings</h2>
        {readings.length > 0 ? (
          readings.map(reading => (
            <div key={reading.id}>
              <p>Timestamp: {new Date(reading.timestamp).toLocaleString()}</p>
              <p>Heart Rate: {reading.heart_rate} bpm</p>
              <p>Temperature: {reading.temperature}°C</p>
              <p>Activity Level: {reading.activity_level}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No readings available</p>
        )}
      </div>
    </div>
  );
}

export default App;
