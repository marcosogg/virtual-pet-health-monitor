import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Main App component
const App = () => {
  return (
    // Flex container for entire app
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header component */}
      <Header />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Error boundary to catch any errors in the Dashboard component */}
        <ErrorBoundary>
          {/* Dashboard component containing the main app functionality */}
          <Dashboard />
        </ErrorBoundary>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default App;
