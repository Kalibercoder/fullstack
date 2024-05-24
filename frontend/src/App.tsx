import React, { Profiler } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login';
import MessagePage from './message';
import RegisterForm from './register';
import Profile from './profile';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;