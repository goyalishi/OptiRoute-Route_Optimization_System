// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import OptimizeRoute from "./pages/OptimizeRoute";
import DriverDashboard from "./pages/DriverDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/Auth" element={<AuthPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/optimize-route" element={<OptimizeRoute />} />
      <Route path='/driver' element={<DriverDashboard/>}/>
    </Routes>
  );
};

export default App;
