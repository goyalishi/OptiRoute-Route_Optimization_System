// src/pages/AuthPage.jsx
import React, { useState } from "react";
import AuthTabs from "../components/AuthTabs";
import InputField from "../components/InputField";
import RoleSelector from "../components/RoleSelector";
import axios from "axios";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("admin");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "login") {
        // LOGIN API CALL
        const res = await axios.post("", {
          email: formData.email,
          password: formData.password,
        });

        alert("Login successful!");
        console.log("Login response:", res.data);
      } else {
        // SIGNUP API CALL
        const res = await axios.post("", {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          company: formData.company,
          role: role,
        });

        alert("Account created successfully!");
        console.log("Signup response:", res.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-green-50">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white shadow-lg rounded-2xl p-8 text-center"
      >
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
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="fullName"
              onChange={handleChange}
            />
          )}

          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={handleChange}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="********"
            onChange={handleChange}
          />

          {activeTab === "signup" && (
            <>
              <InputField
                label="Company"
                type="text"
                name="company"
                placeholder="Company name"
                optional
                onChange={handleChange}
              />
              <RoleSelector role={role} setRole={setRole} />
            </>
          )}

          <button
            type="submit"
            className={`w-full mt-4 text-white font-medium py-2 rounded-md transition ${
              activeTab === "login"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
