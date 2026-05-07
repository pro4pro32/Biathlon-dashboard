import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Athletes from './pages/Athletes';
import Race from './pages/Race';
import Compare from './pages/Compare';

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/race" element={<Race />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;