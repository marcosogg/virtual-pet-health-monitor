import React, { useState } from 'react';
import { addPet } from '../services/api';

function AddPetForm({ onPetAdded }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPet({ name, species });
      setName('');
      setSpecies('');
      onPetAdded();
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-white py-4 px-6 bg-blue-500">Add New Pet</h2>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
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
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">Pet Species</label>
          <select
            id="species"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          >
            <option value="">Select a species</option>
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Pet
        </button>
      </form>
    </div>
  );
}

export default AddPetForm;
