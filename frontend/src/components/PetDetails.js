import React, { useState, useEffect, useMemo } from 'react';
import { getPetReadings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import LoadingSpinner from './LoadingSpinner';

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow rounded">
        <p className="text-primary font-bold">{`Time: ${new Date(label).toLocaleString()}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

const PetDetails = React.memo(({ petId }) => {
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      setIsLoading(true);
      try {
        const response = await getPetReadings(petId);
        setReadings(response.data);
      } catch (error) {
        console.error('Error fetching readings:', error);
        setError('Failed to fetch readings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReadings();
    const interval = setInterval(fetchReadings, 10000); // Fetch every 10 seconds
  
    return () => clearInterval(interval);
  }, [petId]);

  const latestReading = useMemo(() => readings[0] || {}, [readings]);

  const chartData = useMemo(() => {
    return readings.map(reading => ({
      ...reading,
      timestamp: new Date(reading.timestamp).toLocaleTimeString(),
    }));
  }, [readings]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500" role="alert">{error}</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-serif font-semibold mb-4 text-primary-dark">Pet Health Readings</h2>
      {readings.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Latest Reading</h3>
            <p>Timestamp: {new Date(latestReading.timestamp).toLocaleString()}</p>
            <p>Heart Rate: {latestReading.heart_rate} bpm</p>
            <p>Temperature: {latestReading.temperature}°C</p>
            <p>Activity Level: {latestReading.activity_level}</p>
            <p>Respiratory Rate: {latestReading.respiratory_rate} breaths/min</p>
            <p>Hydration Level: {latestReading.hydration_level}%</p>
          </div>

          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Heart Rate and Temperature</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="#8884d8" name="Heart Rate (bpm)" />
                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Activity and Hydration Levels</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="activity_level" stackId="1" stroke="#8884d8" fill="#8884d8" name="Activity Level" />
                <Area type="monotone" dataKey="hydration_level" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Hydration Level (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p role="status">No readings available</p>
      )}
    </div>
  );
});

export default PetDetails;
