import React, { useState, useEffect } from 'react';
import { getPets } from '../services/api';
import PetList from './PetList';
import AddPetForm from './AddPetForm';
import PetDetails from './PetDetails';

const Dashboard = () => {
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-1">
        <AddPetForm onPetAdded={fetchPets} />
        <PetList 
          pets={pets} 
          selectedPetId={selectedPetId} 
          onSelectPet={setSelectedPetId} 
        />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        {selectedPetId ? (
          <PetDetails petId={selectedPetId} />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Select a pet to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;