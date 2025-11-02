// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import OptimizeRoute from "./pages/OptimizeRoute";
import DriverDashboard from "./pages/DriverDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<LandingPage />} />

      {/* Protected Admin Route */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>


      {/* Protected Driver Route */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
