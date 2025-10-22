import React from "react";
import { LogOut } from "lucide-react";

const Navbar = ({ user }) => {
  return (
    <nav className="w-full bg-white shadow-sm flex justify-between items-center px-6 py-3">
    
      <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                RouteOptimizer
              </span>
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
