import React from 'react';

function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm">
          © {new Date().getFullYear()} Virtual Pet Health Monitor. All rights reserved.
        </p>
        <p className="text-center text-xs mt-2">
          Created for HDIP Computer Science 2023 - Networking using Connected Devices
        </p>
      </div>
    </footer>
  );
}

export default Footer;
