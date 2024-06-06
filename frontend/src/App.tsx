import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login';
import MessagePage from './message';
import RegisterForm from './register';
import Profile from './profile';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken')); // Initialize state

  useEffect(() => {
    // Update state when localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/message" element={isAuthenticated ? <MessagePage /> : <Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;