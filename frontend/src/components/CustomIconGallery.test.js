import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomIconGallery from './CustomIconGallery';

describe('CustomIconGallery', () => {
  test('renders all custom icons with their names', () => {
    render(<CustomIconGallery />);

    // Check if the title is rendered
    expect(screen.getByText('Custom Icon Gallery')).toBeInTheDocument();

    // Check if all icon names are rendered
    const iconNames = [
      'heart', 'thermometer', 'lung', 'running', 'moon', 'droplet',
      'dog', 'cat', 'food', 'water', 'paw', 'bell', 'chart', 'calendar', 'pill',
      // Add more icon names here to match the ones you added in UIComponents.js
    ];
    iconNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    // Check if all SVG icons are rendered
    const svgIcons = screen.getAllByRole('img', { hidden: true });
    expect(svgIcons).toHaveLength(iconNames.length);
  });
});