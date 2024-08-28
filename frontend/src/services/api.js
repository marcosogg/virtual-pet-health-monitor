import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000';
const socket = io(API_URL);

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
