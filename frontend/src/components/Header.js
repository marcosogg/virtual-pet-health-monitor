import React from 'react';

function Header() {
  return (
    <header className="bg-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold font-serif">Virtual Pet Health Monitor</h1>
        <p className="text-primary-light mt-2">Keeping your pets healthy and happy!</p>
      </div>
    </header>
  );
}

export default Header;
