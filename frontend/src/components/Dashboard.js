import React, { useState, useEffect, useCallback } from 'react';
import { getPets, getPetHealthMetrics, deletePet, subscribeToNewReadings, unsubscribeFromNewReadings } from '../services/api';
import PetList from './PetList';
import AddPetForm from './AddPetForm';
import { Card, Alert, Button, Modal, MetricCard, Dropdown } from './UIComponents';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [detailMetric, setDetailMetric] = useState(null);

  const fetchPets = useCallback(async () => {
    try {
      const response = await getPets();
      setPets(response.data);
      if (response.data.length > 0 && !selectedPetId) {
        setSelectedPetId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to fetch pets. Please try again.');
    }
  }, [selectedPetId]);

  const handleNewReading = useCallback((data) => {
    if (data.pet_id === selectedPetId) {
      fetchHealthMetrics(selectedPetId);
    }
  }, [selectedPetId]);

  useEffect(() => {
    fetchPets();
    subscribeToNewReadings(handleNewReading);
    return () => {
      unsubscribeFromNewReadings();
    };
  }, [fetchPets, handleNewReading]);

  useEffect(() => {
    if (selectedPetId) {
      fetchHealthMetrics(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchHealthMetrics = async (petId) => {
    try {
      const response = await getPetHealthMetrics(petId);
      setHealthMetrics(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      setError('Failed to fetch health metrics. Please try again.');
      setHealthMetrics(null);
    }
  };

  const handleDeletePet = (petId) => {
    setDeletingPetId(petId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePet = async () => {
    try {
      await deletePet(deletingPetId);
      setShowDeleteConfirmation(false);
      setDeletingPetId(null);
      fetchPets();
      if (selectedPetId === deletingPetId) {
        setSelectedPetId(null);
        setHealthMetrics(null);
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      setError('Failed to delete pet. Please try again.');
    }
  };

  const calculateHealthScore = (metrics) => {
    const weights = {
      heartRate: 0.2,
      temperature: 0.2,
      respirationRate: 0.2,
      activity: 0.2,
      sleepDuration: 0.1,
      waterIntake: 0.1
    };

    const normalRanges = {
      heartRate: [60, 100],
      temperature: [38, 39.2],
      respirationRate: [15, 30],
      activity: [4, 8],
      sleepDuration: [12, 14],
      waterIntake: [20, 70]
    };

    let score = 100;
    let availableMetrics = 0;

    for (const [key, metric] of Object.entries(metrics)) {
      if (metric.value !== 'N/A') {
        availableMetrics++;
        const range = normalRanges[key];
        if (metric.value < range[0] || metric.value > range[1]) {
          const deviation = Math.min(Math.abs(metric.value - range[0]), Math.abs(metric.value - range[1]));
          const maxDeviation = Math.max(range[1] - range[0], Math.abs(range[0]), Math.abs(range[1]));
          const penaltyPercentage = (deviation / maxDeviation) * 100;
          score -= penaltyPercentage * weights[key];
        }
      }
    }

    if (availableMetrics === 0) return 'N/A';
    return Math.max(0, Math.round(score * (6 / availableMetrics)));
  };

  const getSelectedPet = () => {
    return pets.find(pet => pet.id === selectedPetId) || {};
  };

  const renderHealthScoreTooltip = () => (
    <div className="bg-white p-2 rounded shadow-md">
      <p>The overall health score is calculated based on the pet's vital signs and daily activities.</p>
      <p>A score of 100 indicates optimal health, while lower scores suggest areas that may need attention.</p>
    </div>
  );

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return Number(value.toFixed(2));
    }
    return value;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const renderMetricDetails = () => (
    <Modal
      isOpen={!!detailMetric}
      onClose={() => setDetailMetric(null)}
      title={`${detailMetric?.label} Details`}
    >
      {detailMetric && (
        <>
          <p>Current value: {formatValue(detailMetric.value)} {detailMetric.unit}</p>
          <p>Normal range: {detailMetric.normalRange[0]} - {detailMetric.normalRange[1]} {detailMetric.unit}</p>
          <p>Last updated: {formatDate(detailMetric.timestamp)}</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={detailMetric.history}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </Modal>
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-1">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Your Pets</h3>
          <PetList 
            pets={pets} 
            selectedPetId={selectedPetId} 
            onSelectPet={setSelectedPetId}
            onDeletePet={handleDeletePet}
          />
          <Button onClick={() => setShowAddPetModal(true)} className="mt-4 w-full">
            Add New Pet
          </Button>
        </Card>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        {error && <Alert type="error">{error}</Alert>}
        {healthMetrics ? (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Pet Health Dashboard</h2>
                  <Dropdown
                    options={pets.map(pet => ({ value: pet.id, label: pet.name }))}
                    value={selectedPetId}
                    onChange={(value) => setSelectedPetId(value)}
                    className="mt-2"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Overall Health Score</h3>
                  <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto relative group">
                    <span className="text-3xl font-bold text-white">
                      {calculateHealthScore(healthMetrics)}
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      {renderHealthScoreTooltip()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  icon="heart"
                  label="Heart Rate"
                  value={formatValue(healthMetrics.heartRate.value)}
                  unit="bpm"
                  normalRange={[60, 100]}
                  timestamp={formatDate(healthMetrics.heartRate.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.heartRate, label: "Heart Rate", unit: "bpm", normalRange: [60, 100]})}
                />
                <MetricCard
                  icon="thermometer"
                  label="Temperature"
                  value={formatValue(healthMetrics.temperature.value)}
                  unit="°C"
                  normalRange={[38, 39.2]}
                  timestamp={formatDate(healthMetrics.temperature.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.temperature, label: "Temperature", unit: "°C", normalRange: [38, 39.2]})}
                />
                <MetricCard
                  icon="lung"
                  label="Respiration Rate"
                  value={formatValue(healthMetrics.respirationRate.value)}
                  unit="bpm"
                  normalRange={[15, 30]}
                  timestamp={formatDate(healthMetrics.respirationRate.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.respirationRate, label: "Respiration Rate", unit: "bpm", normalRange: [15, 30]})}
                />
                <MetricCard
                  icon="running"
                  label="Activity"
                  value={formatValue(healthMetrics.activity.value)}
                  unit="hours"
                  normalRange={[4, 8]}
                  timestamp={formatDate(healthMetrics.activity.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.activity, label: "Activity", unit: "hours", normalRange: [4, 8]})}
                />
                <MetricCard
                  icon="moon"
                  label="Sleep Duration"
                  value={formatValue(healthMetrics.sleepDuration.value)}
                  unit="hours"
                  normalRange={[12, 14]}
                  timestamp={formatDate(healthMetrics.sleepDuration.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.sleepDuration, label: "Sleep Duration", unit: "hours", normalRange: [12, 14]})}
                />
                <MetricCard
                  icon="droplet"
                  label="Water Intake"
                  value={formatValue(healthMetrics.waterIntake.value)}
                  unit="ml/kg"
                  normalRange={[20, 70]}
                  timestamp={formatDate(healthMetrics.waterIntake.timestamp)}
                  onViewDetails={() => setDetailMetric({...healthMetrics.waterIntake, label: "Water Intake", unit: "ml/kg", normalRange: [20, 70]})}
                />
              </div>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold mb-4">Pet Information</h3>
              <p><strong>Name:</strong> {getSelectedPet().name}</p>
              <p><strong>Species:</strong> {getSelectedPet().species}</p>
              <p><strong>Age:</strong> {getSelectedPet().age} years</p>
              <p><strong>Breed:</strong> {getSelectedPet().breed}</p>
              <p><strong>Weight:</strong> {getSelectedPet().weight} kg</p>
              <p><strong>Last Check-up:</strong> {formatDate(getSelectedPet().lastCheckup)}</p>
            </Card>
          </div>
        ) : (
          <Card>
            <p className="text-gray-500">Select a pet to view health metrics</p>
          </Card>
        )}
      </div>
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this pet?</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setShowDeleteConfirmation(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={confirmDeletePet} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        title="Add New Pet"
      >
        <AddPetForm onPetAdded={() => { fetchPets(); setShowAddPetModal(false); }} />
      </Modal>
      {renderMetricDetails()}
    </div>
  );
};

export default Dashboard;
