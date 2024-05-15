import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login';
import MessagePage from './message';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/message" element={<MessagePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;