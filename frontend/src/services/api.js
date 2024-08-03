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
