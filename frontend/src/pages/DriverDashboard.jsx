import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiActivity } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Card from '../components/DriverDashboard/Card';
import DeliveryList from '../components/DriverDashboard/DeliveryList';
import toast, { Toaster } from 'react-hot-toast';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: sessionStorage.getItem("username"),
    role: sessionStorage.getItem("role"),
    userId: sessionStorage.getItem("userId"),
  });

  const [activeTab, setActiveTab] = useState("routemap");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      if (!user.userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/driver/dashboard/${user.userId}`);
      setDashboardData(response.data);
      console.log("Dashboard Data:", response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  // Update the user object with logout method
  const userWithLogout = { ...user, onLogout: handleLogout };

  const handleUpdateStatus = async (deliveryId, newStatus, failureReason = null) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_APP_SERVER_URL}/api/driver/delivery/${deliveryId}/status`, {
        status: newStatus,
        driverId: user.userId,
        failureReason
      });

      if (response.status === 200) {
        toast.success(response.data.message || `Status updated to ${newStatus}`);
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || `Failed to update status to ${newStatus}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const stats = dashboardData?.summary || {
    totalDeliveries: 0,
    completed: 0,
    inProgress: 0,
    assigned: 0
  };

  const currentRoute = dashboardData?.assignedRoutes?.[0];
  const deliveries = currentRoute?.deliveryPoints || [];

  const handleStartRoute = async () => {
    if (!currentRoute?._id) return;
    try {
      await axios.patch(`${import.meta.env.VITE_APP_SERVER_URL}/api/driver/route/${currentRoute._id}/start`, {
        driverId: user.userId
      });
      toast.success("Route started successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error starting route:", err);
      // Show more detailed error message if available
      toast.error(err.response?.data?.message || "Failed to start route");
    }
  };

  const handleCompleteRoute = async () => {
    if (!currentRoute?._id) return;
    try {
      await axios.patch(`${import.meta.env.VITE_APP_SERVER_URL}/api/driver/route/${currentRoute._id}/complete`, {
        driverId: user.userId
      });
      toast.success("Route completed successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error completing route:", err);
      if (err.response?.data?.pendingDeliveries) {
        const pending = err.response.data.pendingDeliveries;
        const pendingCount = pending.length;
        toast.error(`${err.response.data.message}\n${pendingCount} pending deliveries.`);
      } else {
        toast.error(err.response?.data?.message || "Failed to complete route");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      <Toaster />
      <Navbar user={userWithLogout} />

      {/* Tabs Section */}
      <div className="flex ml-14 mt-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-100 to-green-100 shadow-md py-2 px-3 text-black w-fit">
          {[
            { id: "routemap", label: "RouteMap", icon: "📊" },
            { id: "deliveries", label: "Deliveries", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-3xl text-base font-medium transition-all duration-300 ${activeTab === tab.id
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


      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full px-6 lg:px-16">
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon="📦"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon="⏱️"
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Assigned"
          value={stats.assigned}
          icon={<FiActivity className="text-xl" />}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div>
        {activeTab === "routemap" && (
          <>
            <div className="w-full px-6 lg:px-16 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border w-full flex flex-col items-center justify-center transition-transform hover:scale-[1.01]">
                <div className="w-full flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Route Overview</h2>
                  <div className="flex gap-3">
                    {/* Start/Complete Buttons */}
                    {currentRoute && (
                      <>
                        <button
                          onClick={handleStartRoute}
                          disabled={currentRoute.status === 'in-progress' || currentRoute.status === 'completed'}
                          className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${currentRoute.status === 'assigned'
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                          Start Route
                        </button>
                        <button
                          onClick={handleCompleteRoute}
                          disabled={currentRoute.status !== 'in-progress'}
                          className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${currentRoute.status === 'in-progress'
                            ? 'bg-green-600 hover:bg-green-700 shadow-md'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                          Complete Route
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex flex-col items-center justify-center text-gray-600 font-medium shadow-sm">
                  <FiMapPin className="text-5xl mb-3 text-gray-500" />
                  <p className="text-lg">Map Preview Coming Soon 🗺️</p>
                  {currentRoute?.googleMapsLink && (
                    <a
                      href={currentRoute.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Open in Google Maps
                    </a>
                  )}
                </div>
                <Card route={currentRoute} />
              </div>
            </div>

            <div className="w-full px-6 lg:px-16 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border w-full flex flex-col  justify-center transition-transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery List</h2>
                <DeliveryList deliveries={deliveries} onUpdateStatus={handleUpdateStatus} />
              </div>
            </div>

          </>
        )}

        {/* Reuse DeliveryList for deliveries tab or similar content */}
        {activeTab === "deliveries" && (
          <div className="w-full px-6 lg:px-16 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border w-full flex flex-col  justify-center transition-transform hover:scale-[1.01]">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">All Deliveries</h2>
              <DeliveryList deliveries={deliveries} onUpdateStatus={handleUpdateStatus} />
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-lg border hover:shadow-xl transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <div className={`${color} rounded-full p-2 text-xl`}>{icon}</div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default DriverDashboard;