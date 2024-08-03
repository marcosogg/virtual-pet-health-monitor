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
