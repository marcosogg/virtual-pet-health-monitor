import React from 'react';
import dogCatLogo from '../dogcat.png';

function Header() {
  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-end">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Virtual Pet Health Monitor</h1>
          <p className="text-primary-200 mt-2">Keeping your pets healthy and happy!</p>
        </div>
        <div className="flex items-end">
          <img 
            src={dogCatLogo} 
            alt="Dog and cat logo" 
            className="h-24 w-auto object-contain mb-[-1rem]"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
