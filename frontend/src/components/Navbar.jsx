import React from "react";
import { LogOut } from "lucide-react";

const Navbar = ({ user }) => {
  return (
    <nav className="w-full bg-white shadow-sm flex justify-between items-center px-6 py-3">
    
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5h-2.25a2.25 2.25 0 00-2.25 2.25v2.25m18 0V6.75A2.25 2.25 0 0018.75 4.5h-2.25M15.75 19.5h2.25a2.25 2.25 0 002.25-2.25v-2.25m-18 0v2.25A2.25 2.25 0 005.25 19.5h2.25"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Route Optimizer</h1>
          <p className="text-sm text-gray-500">
            {user.role === "admin" ? "Admin Dashboard" : "Driver Dashboard"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
        <button
          onClick={user.onLogout}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-medium px-4 py-2 rounded-md shadow-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
