import React, { useState, useEffect } from 'react';
import { getPetReadings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PetDetails = ({ petId }) => {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await getPetReadings(petId);
        console.log("Received readings:", response.data);
        setReadings(response.data);
      } catch (error) {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings. Please try again.');
      }
    };
  
    fetchReadings();
    const interval = setInterval(fetchReadings, 10000); // Fetch every 10 seconds
  
    return () => clearInterval(interval);
  }, [petId]);
  

  const getDataTrend = (data) => {
    if (data.length < 2) return 'Not enough data';
    const lastTwo = data.slice(-2);
    return lastTwo[1] > lastTwo[0] ? 'Increasing' : 'Decreasing';
  };

  const isAbnormalReading = (reading) => {
    return reading.heart_rate > 120 || reading.heart_rate < 60 ||
           reading.temperature > 39.5 || reading.temperature < 37.5 ||
           reading.activity_level > 8 || reading.activity_level < 2;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IE', { 
      timeZone: 'Europe/Dublin',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  

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
            <p>Timestamp: {formatTimestamp(readings[0].timestamp)}</p>
            <p>Heart Rate: {readings[0].heart_rate} bpm (Trend: {getDataTrend(readings.map(r => r.heart_rate))})</p>
            <p>Temperature: {readings[0].temperature}°C (Trend: {getDataTrend(readings.map(r => r.temperature))})</p>
            <p>Activity Level: {readings[0].activity_level} (Trend: {getDataTrend(readings.map(r => r.activity_level))})</p>
            {isAbnormalReading(readings[0]) && (
              <p className="text-red-500 font-bold mt-2">Alert: Abnormal reading detected!</p>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p>Latitude: {readings[0].latitude}</p>
            <p>Longitude: {readings[0].longitude}</p>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Heart Rate Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
                />
                <YAxis />
                <Tooltip labelFormatter={(timestamp) => formatTimestamp(timestamp)} />
                <Legend />
                <Line type="monotone" dataKey="heart_rate" stroke="#8884d8" name="Heart Rate (bpm)" />
                <Line type="monotone" dataKey="smoothed_heart_rate" stroke="#82ca9d" name="Smoothed Heart Rate (bpm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Temperature Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
                />
                <YAxis />
                <Tooltip labelFormatter={(timestamp) => formatTimestamp(timestamp)} />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
                <Line type="monotone" dataKey="smoothed_temperature" stroke="#82ca9d" name="Smoothed Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80">
            <h3 className="text-lg font-medium mb-2">Activity Level Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
                />
                <YAxis />
                <Tooltip labelFormatter={(timestamp) => formatTimestamp(timestamp)} />
                <Legend />
                <Line type="monotone" dataKey="activity_level" stroke="#8884d8" name="Activity Level" />
                <Line type="monotone" dataKey="smoothed_activity_level" stroke="#82ca9d" name="Smoothed Activity Level" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No readings available</p>
      )}
    </div>
  );
};

export default PetDetails;