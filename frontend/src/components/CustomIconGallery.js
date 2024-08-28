import React from 'react';

const CustomIconGallery = () => {
  const icons = [
    { name: 'heart', icon: '❤️' },
    { name: 'thermometer', icon: '🌡️' },
    { name: 'lung', icon: '🫁' },
    { name: 'running', icon: '🏃' },
    { name: 'moon', icon: '🌙' },
    { name: 'droplet', icon: '💧' },
    { name: 'dog', icon: '🐕' },
    { name: 'cat', icon: '🐈' },
    { name: 'food', icon: '🍖' },
    { name: 'water', icon: '💧' },
    { name: 'paw', icon: '🐾' },
    { name: 'bell', icon: '🔔' },
    { name: 'chart', icon: '📊' },
    { name: 'calendar', icon: '📅' },
    { name: 'pill', icon: '💊' },
    { name: 'vaccine', icon: '💉' },
    { name: 'stethoscope', icon: '🩺' },
    { name: 'bone', icon: '🦴' },
    { name: 'fish', icon: '🐠' },
    { name: 'bird', icon: '🐦' },
    { name: 'rabbit', icon: '🐰' },
    { name: 'hamster', icon: '🐹' },
    { name: 'turtle', icon: '🐢' },
    { name: 'poop', icon: '💩' },
    { name: 'leash', icon: '🐕‍🦺' },
    { name: 'brush', icon: '🧹' },
    { name: 'scissors', icon: '✂️' },
    { name: 'bath', icon: '🛁' },
    { name: 'toy', icon: '🧸' },
    { name: 'bed', icon: '🛏️' },
    { name: 'house', icon: '🏠' },
    { name: 'park', icon: '🏞️' },
    { name: 'vet', icon: '👨‍⚕️' },
    { name: 'microscope', icon: '🔬' },
    { name: 'x-ray', icon: '🦴' },
    { name: 'bandage', icon: '🩹' },
    { name: 'weight', icon: '⚖️' },
    { name: 'collar', icon: '🔗' },
    { name: 'clock', icon: '⏰' },
    { name: 'sun', icon: '☀️' },
    { name: 'rain', icon: '🌧️' },
    { name: 'snow', icon: '❄️' },
    { name: 'hot', icon: '🥵' },
    { name: 'cold', icon: '🥶' },
    { name: 'flea', icon: '🐜' },
    { name: 'tick', icon: '🕷️' },
    { name: 'grooming', icon: '💇' },
    { name: 'tooth', icon: '🦷' },
    { name: 'ear', icon: '👂' },
    { name: 'eye', icon: '👁️' },
    { name: 'nose', icon: '👃' },
    { name: 'paw-print', icon: '🐾' },
    { name: 'first-aid-kit', icon: '🧳' },
    { name: 'pet-carrier', icon: '🧳' },
    { name: 'pet-food-bowl', icon: '🥣' },
  ];

  return (
    <div className="custom-icon-gallery">
      <h2>Custom Icon Gallery</h2>
      <div className="icon-grid">
        {icons.map((icon, index) => (
          <div key={index} className="icon-item">
            <span className="icon">{icon.icon}</span>
            <span className="icon-name">{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomIconGallery;