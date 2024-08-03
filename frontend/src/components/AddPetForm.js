import React, { useState } from 'react';
import { addPet } from '../services/api';

function AddPetForm({ onPetAdded }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await addPet({ name, species });
      setName('');
      setSpecies('');
      setSuccess(true);
      onPetAdded();
    } catch (error) {
      console.error('Error adding pet:', error);
      setError(error.response?.data?.error || 'Failed to add pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-serif font-semibold mb-4 text-primary-dark">Add New Pet</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pet Name</label>
          <input
            type="text"
            id="name"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
              name ? 'border-green-300 focus:border-green-300 focus:ring-green-200' : 'border-gray-300 focus:border-primary focus:ring-primary-light'
            }`}
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
              species ? 'border-green-300 focus:border-green-300 focus:ring-green-200' : 'border-gray-300 focus:border-primary focus:ring-primary-light'
            }`}
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">Pet added successfully!</p>}
    </div>
  );
}

export default AddPetForm;
