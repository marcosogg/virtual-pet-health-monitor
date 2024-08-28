import React, { useState, useEffect, useMemo } from 'react';
import { getPetReadings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaMoon, FaUtensils } from 'react-icons/fa';
import { Card, LoadingSpinner, Alert } from './UIComponents';

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-white p-4 shadow-lg">
        <p className="text-primary-600 font-bold">{`Time: ${new Date(label).toLocaleString()}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-700" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} ${entry.unit || ''}`}
          </p>
        ))}
      </Card>
    );
  }
  return null;
});

const formatSleepDuration = (minutes) => {
  if (minutes === undefined || minutes === null) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatHoursSinceFeeding = (hours) => {
  if (hours === undefined || hours === null) return 'N/A';
  return `${hours.toFixed(1)} hours`;
};

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
    return <Alert type="error">{error}</Alert>;
  }

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-serif font-semibold mb-4 text-primary-600">Pet Health Readings</h2>
      {readings.length > 0 ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <Card className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-2 text-secondary-600">Latest Reading</h3>
              <p className="text-gray-700">Timestamp: {new Date(latestReading.timestamp).toLocaleString()}</p>
              <p className="text-gray-700">Heart Rate: {latestReading.heart_rate} bpm</p>
              <p className="text-gray-700">Temperature: {latestReading.temperature}°C</p>
              <p className="text-gray-700">Activity Level: {latestReading.activity_level}</p>
              <p className="text-gray-700">Respiratory Rate: {latestReading.respiratory_rate} breaths/min</p>
              <p className="text-gray-700">Hydration Level: {latestReading.hydration_level}%</p>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-medium mb-2 text-secondary-600">New Metrics</h3>
              <div className="flex items-center mb-2">
                <FaMoon className="mr-2 text-primary-500" />
                <p className="text-gray-700">Sleep Duration: {formatSleepDuration(latestReading.sleep_duration)}</p>
              </div>
              <div className="flex items-center">
                <FaUtensils className="mr-2 text-secondary-500" />
                <p className="text-gray-700">Hours Since Feeding: {formatHoursSinceFeeding(latestReading.hours_since_feeding)}</p>
              </div>
            </Card>
          </div>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Heart Rate and Temperature</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="#3182ce" name="Heart Rate" unit="bpm" />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#48bb78" name="Temperature" unit="°C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Activity and Hydration Levels</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="activity_level" stackId="1" stroke="#3182ce" fill="#63b3ed" name="Activity Level" />
                  <Area type="monotone" dataKey="hydration_level" stackId="2" stroke="#48bb78" fill="#9ae6b4" name="Hydration Level" unit="%" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-secondary-600">Sleep Duration and Feeding</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sleep_duration" stroke="#3182ce" name="Sleep Duration" unit=" minutes" />
                  <Line yAxisId="right" type="monotone" dataKey="hours_since_feeding" stroke="#48bb78" name="Hours Since Feeding" unit=" hours" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : (
        <Alert type="info">No readings available</Alert>
      )}
    </Card>
  );
});

export default PetDetails;
