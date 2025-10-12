// src/pages/AuthPage.jsx
import React, { useState } from "react";
import AuthTabs from "../components/AuthTabs";
import InputField from "../components/InputField";
import RoleSelector from "../components/RoleSelector";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("admin");

  const handleSubmit = () => {
    if (activeTab === "login") {
      alert("Logging in...");
    } else {
      alert("Account created successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-green-50">
      <div className="w-[380px] bg-white shadow-lg rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            🚚
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">Route Optimizer</h1>
        <p className="text-sm text-gray-500 mb-4">
          Smart logistics and delivery management
        </p>

        {/* Tabs for Login / Sign Up */}
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6 space-y-4 text-left">
          {activeTab === "signup" && (
            <InputField label="Full Name" type="text" placeholder="John Doe" />
          )}

          <InputField label="Email" type="email" placeholder="your@email.com" />
          <InputField label="Password" type="password" placeholder="********" />

          {activeTab === "signup" && (
            <>
              <InputField
                label="Company"
                type="text"
                placeholder="Company name"
                optional
              />
              <RoleSelector role={role} setRole={setRole} />
            </>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full mt-4 text-white font-medium py-2 rounded-md transition ${
              activeTab === "login"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
