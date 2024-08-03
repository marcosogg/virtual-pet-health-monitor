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
