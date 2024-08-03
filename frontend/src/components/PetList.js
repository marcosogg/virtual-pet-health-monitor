import React from 'react';

function PetList({ pets, selectedPetId, onSelectPet }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-primary-dark font-serif">Your Pets</h2>
      {pets.length > 0 ? (
        <ul className="space-y-2" role="list" aria-label="List of pets">
          {pets.map(pet => (
            <li key={pet.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded transition ${
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
