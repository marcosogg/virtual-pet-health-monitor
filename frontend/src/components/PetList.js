import React from 'react';

function PetList({ pets, selectedPetId, onSelectPet }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Your Pets</h2>
      {pets.length > 0 ? (
        <ul className="space-y-2">
          {pets.map(pet => (
            <li key={pet.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded transition ${
                  pet.id === selectedPetId 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelectPet(pet.id)}
              >
                {pet.name} ({pet.species})
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pets added yet.</p>
      )}
    </div>
  );
}

export default PetList;
