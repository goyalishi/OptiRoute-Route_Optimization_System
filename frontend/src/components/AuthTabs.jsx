// src/components/AuthTabs.jsx
//nothing for change
import React from "react";

const AuthTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full rounded-full bg-gray-100 p-1 mt-4">
      <button
        onClick={() => setActiveTab("login")}
        className={`w-1/2 py-2 rounded-full text-sm font-semibold ${
          activeTab === "login"
            ? "bg-white shadow text-black"
            : "text-gray-500 hover:text-black"
        }`}
      >
        Login
      </button>
      <button
        onClick={() => setActiveTab("signup")}
        className={`w-1/2 py-2 rounded-full text-sm font-semibold ${
          activeTab === "signup"
            ? "bg-white shadow text-black"
            : "text-gray-500 hover:text-black"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
