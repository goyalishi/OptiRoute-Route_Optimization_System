import React, { useState } from "react";
import AuthTabs from "../components/AuthTabs";
import InputField from "../components/InputField";
import RoleSelector from "../components/RoleSelector";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("driver");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    adminEmail: "",   
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "login") {
        // Try admin login first
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/login`,
            {
              email: formData.email,
              password: formData.password,
            }
          );

          if (res.data.role === "admin") {
            sessionStorage.setItem("token", res.data.accessToken);
            sessionStorage.setItem("role", res.data.role);
            sessionStorage.setItem("userId", res.data.user.id);
            sessionStorage.setItem("username", res.data.user.username);
            alert(`Welcome back, ${res.data.user.username}!`);
            navigate("/admin/dashboard");
            return;
          }
        } catch (adminErr) {
          // If admin login fails => try driver login
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/login`,
              {
                email: formData.email,
                password: formData.password,
              }
            );

            if (res.data.role === "driver") {
              sessionStorage.setItem("token", res.data.accessToken);
              sessionStorage.setItem("role", res.data.role);
              sessionStorage.setItem("username", res.data.user.username);
              alert(`Welcome back, ${res.data.user.username}!`);
              navigate("/driver/dashboard");
              return;
            }
          } catch (driverErr) {
            const msg =
              "Invalid credentials or account does not exist. Please try again.";
            alert(msg);
          }
        }
      } else {
        // SIGNUP LOGIC
        if (role === "admin") {
          const res = await axios.post(
            `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/signup`,
            {
              username: formData.fullName,
              email: formData.email,
              password: formData.password,
            }
          );

          sessionStorage.setItem("username", res.data.user.username);
          sessionStorage.setItem("role", "admin");
          alert("Admin account created successfully!");
          navigate("/admin/dashboard");
        } else {
          // DRIVER SIGNUP + ADMIN EMAIL SEND
          const res = await axios.post(
            `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/signup`,
            {
              name: formData.fullName,
              email: formData.email,
              password: formData.password,
              adminEmail: formData.adminEmail, // <-- SEND NEW FIELD
            }
          );

          alert(
            "Driver account created successfully! Wait for admin verification before logging in."
          );
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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

        <h1 className="text-2xl font-semibold text-gray-800">
          Route Optimizer
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Smart logistics and delivery management
        </p>

        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6 space-y-4 text-left">
          {activeTab === "signup" && (
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
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

          {/* SHOW ONLY WHEN SIGNUP + ROLE = DRIVER */}
          {activeTab === "signup" && role === "driver" && (
            <InputField
              label="Admin Email"
              type="email"
              name="adminEmail"
              placeholder="admin@example.com"
              onChange={handleChange}
            />
          )}

          {activeTab === "signup" && (
            <RoleSelector role={role} setRole={setRole} />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 text-white font-medium py-2 rounded-md transition ${
              activeTab === "login"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Please wait..."
              : activeTab === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
