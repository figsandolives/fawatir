import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import Cashier from './Cashier';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cashier" element={<Cashier />} />
      </Routes>
    </Router>
  );
}
export default App;