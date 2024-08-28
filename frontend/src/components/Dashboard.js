import React, { useState, useEffect } from 'react';
import { getPets, getPetHealthMetrics, deletePet, subscribeToNewReadings, unsubscribeFromNewReadings } from '../services/api';
import PetList from './PetList';
import AddPetForm from './AddPetForm';
import { Card, Alert, Icon, Tooltip, Button, Modal } from './UIComponents';

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchPets();
    subscribeToNewReadings(handleNewReading);
    return () => {
      unsubscribeFromNewReadings();
    };
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchHealthMetrics(selectedPetId);
    }
  }, [selectedPetId]);

  const handleNewReading = (data) => {
    if (data.pet_id === selectedPetId) {
      fetchHealthMetrics(selectedPetId);
    }
  };

  const fetchPets = async () => {
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
  };

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

  const getStatusColor = (value, normalRange) => {
    if (value === 'N/A') return 'text-gray-500';
    if (value < normalRange[0]) return 'text-red-500';
    if (value > normalRange[1]) return 'text-red-500';
    if (value === normalRange[0] || value === normalRange[1]) return 'text-yellow-500';
    return 'text-green-500';
  };

  const renderMetric = (metric, icon, normalRange, unit) => (
    <Tooltip text={`Normal range: ${normalRange[0]}-${normalRange[1]} ${unit}`}>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div className="flex items-center">
          <Icon name={icon} className="w-8 h-8 mr-4" />
          <div>
            <h3 className="text-lg font-semibold">{metric.name}</h3>
            <p className={`text-2xl font-bold ${getStatusColor(metric.value, normalRange)}`}>
              {metric.value === 'N/A' ? 'N/A' : `${metric.value} ${unit}`}
            </p>
          </div>
        </div>
      </div>
    </Tooltip>
  );

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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-1">
        <Card>
          <AddPetForm onPetAdded={fetchPets} />
        </Card>
        <Card className="mt-6">
          <PetList 
            pets={pets} 
            selectedPetId={selectedPetId} 
            onSelectPet={setSelectedPetId}
            onDeletePet={handleDeletePet}
          />
        </Card>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        {error && <Alert type="error">{error}</Alert>}
        {healthMetrics ? (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Pet Health Dashboard</h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{getSelectedPet().name}</h3>
                  <p className="text-gray-600">{getSelectedPet().species}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Overall Health Score</h3>
                  <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-white">
                      {calculateHealthScore(healthMetrics)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderMetric(healthMetrics.heartRate, 'heart', [60, 100], 'bpm')}
                {renderMetric(healthMetrics.temperature, 'thermometer', [38, 39.2], '°C')}
                {renderMetric(healthMetrics.respirationRate, 'lung', [15, 30], 'bpm')}
                {renderMetric(healthMetrics.activity, 'running', [4, 8], 'hours')}
                {renderMetric(healthMetrics.sleepDuration, 'moon', [12, 14], 'hours')}
                {renderMetric(healthMetrics.waterIntake, 'droplet', [20, 70], 'ml/kg')}
              </div>
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
    </div>
  );
};

export default Dashboard;
