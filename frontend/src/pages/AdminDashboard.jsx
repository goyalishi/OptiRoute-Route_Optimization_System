import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const user = {
    name: "Hariom Sharma",
    role: "admin",
    onLogout: () => alert("Logged out successfully!"),
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dummy data
  useEffect(() => {
    if (activeTab === "routes" || activeTab === "drivers") {
      setLoading(true);
      const apiUrl =
        activeTab === "routes"
          ? "https://jsonplaceholder.typicode.com/todos?_limit=5"
          : "https://jsonplaceholder.typicode.com/users?_limit=5";
      axios
        .get(apiUrl)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar user={user} />

      {/* Tabs Section */}
      <div className="flex ml-14 mt-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-100 to-green-100 shadow-md py-2 px-3 text-black w-fit">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "routes", label: "Routes", icon: "🛣️" },
            { id: "drivers", label: "Drivers", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-3xl text-base font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-white/80 hover:text-blue-600"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 max-w-7xl mx-auto">
        {activeTab === "overview" && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome back, {user.name} 👋
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Deliveries"
                value="1,245"
                icon="📦"
                color="bg-blue-100 text-blue-600"
              />
              <StatCard
                title="Distance Saved"
                value="342 km"
                icon="🛣️"
                color="bg-green-100 text-green-600"
              />
              <StatCard
                title="Completion Rate"
                value="98%"
                icon="✅"
                color="bg-emerald-100 text-emerald-600"
              />
              <StatCard
                title="Avg Delivery Time"
                value="23 min"
                icon="⏱️"
                color="bg-teal-100 text-teal-600"
              />
            </div>

            {/* Optimize & Map Section */}
            <div className="flex flex-col lg:flex-row gap-8 mt-10">
              {/* Optimize Route Button */}
              <div className="flex-1 flex items-center justify-center">
                <button
                  onClick={() => navigate("/admin/optimize-route")}
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2 text-center"
                >
                  🚀 Optimize New Route
                  <span className="text-sm font-medium text-white/90">
                    Plan & Assign Vehicles
                  </span>
                </button>
              </div>

              {/* Map Preview */}
              <div className="flex-1 bg-white rounded-2xl shadow-2xl border flex flex-col items-center justify-start transition-transform hover:scale-[1.02]">
                <div className="w-full bg-gradient-to-r from-blue-600 to-green-500 rounded-t-2xl p-4 text-white text-lg font-semibold text-center">
                  Live Route Map
                </div>
                <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-b-2xl flex items-center justify-center text-gray-500 font-medium text-lg">
                  🗺️ Map Preview Coming Soon
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "routes" && (
          <RoutesTable loading={loading} data={data} />
        )}

        {activeTab === "drivers" && (
          <DriversGrid loading={loading} data={data} />
        )}
      </div>
    </div>
  );
};

// ---- Components ---- //

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-lg border hover:shadow-xl transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <div className={`${color} rounded-full p-2 text-xl`}>{icon}</div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const RoutesTable = ({ loading, data }) => (
  <div>
    <h2 className="text-3xl font-semibold mb-6 text-gray-800">All Routes</h2>
    {loading ? (
      <p className="text-gray-500">Loading routes...</p>
    ) : (
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-blue-600 to-green-500 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Route Name</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((route) => (
              <tr
                key={route.id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="p-3">{route.id}</td>
                <td className="p-3">{route.title}</td>
                <td className="p-3">
                  {route.completed ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm font-medium">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const DriversGrid = ({ loading, data }) => (
  <div>
    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Driver Details</h2>
    {loading ? (
      <p className="text-gray-500">Loading drivers...</p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((driver) => (
          <div
            key={driver.id}
            className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-transform hover:scale-[1.02]"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {driver.name}
            </h3>
            <p className="text-gray-600 text-sm mb-1">✉️ {driver.email}</p>
            <p className="text-gray-600 text-sm mb-1">
              📍 {driver.address?.city}
            </p>
            <p className="text-gray-600 text-sm">🏢 {driver.company?.name}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminDashboard;
