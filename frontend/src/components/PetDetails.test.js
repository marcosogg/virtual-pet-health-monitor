import React from 'react';
import { render, screen } from '@testing-library/react';
import PetDetails from './PetDetails';
import { getPetReadings } from '../services/api';

jest.mock('../services/api');

const mockReading = {
  timestamp: '2023-09-01T12:00:00Z',
  heart_rate: 80,
  temperature: 38.5,
  activity_level: 7,
  respiratory_rate: 20,
  hydration_level: 70,
  sleep_duration: 360,
  hours_since_feeding: 4.5
};

describe('PetDetails', () => {
  beforeEach(() => {
    getPetReadings.mockResolvedValue({ data: [mockReading] });
  });

  it('renders new metrics correctly', async () => {
    render(<PetDetails petId={1} />);

    // Wait for the component to load data
    await screen.findByText(/Latest Reading/i);

    // Check if new metrics are displayed
    expect(screen.getByText(/Sleep Duration: 6h 0m/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours Since Feeding: 4.5 hours/i)).toBeInTheDocument();
  });

  it('displays N/A for missing data', async () => {
    const incompleteReading = { ...mockReading, sleep_duration: null, hours_since_feeding: undefined };
    getPetReadings.mockResolvedValue({ data: [incompleteReading] });

    render(<PetDetails petId={1} />);

    // Wait for the component to load data
    await screen.findByText(/Latest Reading/i);

    // Check if N/A is displayed for missing data
    expect(screen.getByText(/Sleep Duration: N\/A/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours Since Feeding: N\/A/i)).toBeInTheDocument();
  });
});