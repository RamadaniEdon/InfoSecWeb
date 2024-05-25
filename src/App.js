import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Encrypt from './pages/Encrypt';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/encrypt/*"
        element={
          <PrivateRoute>
            <Encrypt />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
