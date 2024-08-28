import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CustomIconGallery from './components/CustomIconGallery';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {isDevelopment && (
                <Route path="/icon-gallery" element={<CustomIconGallery />} />
              )}
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
