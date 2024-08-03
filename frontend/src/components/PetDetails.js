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

  const getAlerts = (readings) => {
    if (readings.length === 0) return [];

    const latestReading = readings[0];
    const alerts = [];

    // Helper function to check if a value is outside a range
    const isOutsideRange = (value, min, max) => value < min || value > max;

    // Helper function to check if a trend is concerning
    const isTrendConcerning = (data, threshold) => {
      if (data.length < 3) return false;
      const recentReadings = data.slice(0, 3);
      return recentReadings.every(v => v > threshold) || recentReadings.every(v => v < threshold);
    };

    // Check heart rate
    if (isOutsideRange(latestReading.heart_rate, 60, 120)) {
      const severity = isOutsideRange(latestReading.heart_rate, 50, 130) ? 'Critical' : 'Warning';
      alerts.push({
        type: 'Heart Rate',
        message: `${severity}: Heart rate is ${latestReading.heart_rate} bpm`,
        advice: 'Consider checking for signs of stress or illness'
      });
    } else if (isTrendConcerning(readings.map(r => r.heart_rate), 110)) {
      alerts.push({
        type: 'Heart Rate',
        message: 'Warning: Heart rate has been consistently high',
        advice: 'Monitor closely and consider reducing activity'
      });
    }

    // Check temperature
    if (isOutsideRange(latestReading.temperature, 37.5, 39.5)) {
      const severity = isOutsideRange(latestReading.temperature, 37, 40) ? 'Critical' : 'Warning';
      alerts.push({
        type: 'Temperature',
        message: `${severity}: Temperature is ${latestReading.temperature}°C`,
        advice: 'Check for signs of fever or hypothermia'
      });
    }

    // Check respiratory rate
    if (isOutsideRange(latestReading.respiratory_rate, 15, 30)) {
      alerts.push({
        type: 'Respiratory Rate',
        message: `Warning: Respiratory rate is ${latestReading.respiratory_rate} breaths/min`,
        advice: 'Monitor breathing and check for signs of respiratory distress'
      });
    }

    // Check hydration level
    if (latestReading.hydration_level < 50) {
      alerts.push({
        type: 'Hydration',
        message: 'Warning: Low hydration level',
        advice: 'Ensure fresh water is available and encourage drinking'
      });
    }

    // Check sleep duration
    if (isOutsideRange(latestReading.sleep_duration, 4, 20)) {
      alerts.push({
        type: 'Sleep',
        message: `Warning: Unusual sleep duration of ${latestReading.sleep_duration} hours`,
        advice: 'Monitor for changes in behavior or energy levels'
      });
    }

    // Check hours since feeding
    if (latestReading.hours_since_feeding > 12) {
      alerts.push({
        type: 'Feeding',
        message: 'Warning: It has been over 12 hours since last feeding',
        advice: 'Consider offering food if appropriate for feeding schedule'
      });
    }

    return alerts;
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

  const alerts = getAlerts(readings);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Pet Health Readings</h2>
      {readings.length > 0 ? (
        <>
          {alerts.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">Alerts:</p>
              <ul className="list-disc list-inside">
                {alerts.map((alert, index) => (
                  <li key={index}>
                    <strong>{alert.type}:</strong> {alert.message}
                    <br />
                    <span className="text-sm italic">Advice: {alert.advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Latest Reading</h3>
            <p>Timestamp: {formatTimestamp(readings[0].timestamp)}</p>
            <p>Heart Rate: {readings[0].heart_rate} bpm (Trend: {getDataTrend(readings.map(r => r.heart_rate))})</p>
            <p>Temperature: {readings[0].temperature}°C (Trend: {getDataTrend(readings.map(r => r.temperature))})</p>
            <p>Activity Level: {readings[0].activity_level} (Trend: {getDataTrend(readings.map(r => r.activity_level))})</p>
            <p>Respiratory Rate: {readings[0].respiratory_rate} breaths/min (Trend: {getDataTrend(readings.map(r => r.respiratory_rate))})</p>
            <p>Hydration Level: {readings[0].hydration_level}% (Trend: {getDataTrend(readings.map(r => r.hydration_level))})</p>
            <p>Sleep Duration: {readings[0].sleep_duration} hours (Trend: {getDataTrend(readings.map(r => r.sleep_duration))})</p>
            <p>Hours Since Feeding: {readings[0].hours_since_feeding} hours (Trend: {getDataTrend(readings.map(r => r.hours_since_feeding))})</p>
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
                <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Respiratory Rate Chart</h3>
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
                <Line type="monotone" dataKey="respiratory_rate" stroke="#ffc658" name="Respiratory Rate (breaths/min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Hydration Level Chart</h3>
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
                <Line type="monotone" dataKey="hydration_level" stroke="#8884d8" name="Hydration Level (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Sleep Duration Chart</h3>
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
                <Line type="monotone" dataKey="sleep_duration" stroke="#82ca9d" name="Sleep Duration (hours)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 mb-6">
            <h3 className="text-lg font-medium mb-2">Hours Since Feeding Chart</h3>
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
                <Line type="monotone" dataKey="hours_since_feeding" stroke="#ffc658" name="Hours Since Feeding" />
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
