// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import OptimizeRoute from "./pages/OptimizeRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/optimize-route" element={<OptimizeRoute />} />
    </Routes>
  );
};

export default App;
