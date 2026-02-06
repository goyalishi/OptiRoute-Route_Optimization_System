import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import AssignedRouteCard from '../components/DriverDashboard/AssignedRouteCard';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: sessionStorage.getItem("username"),
    role: sessionStorage.getItem("role"),
    userId: sessionStorage.getItem("userId"),
  });

  const [activeTab, setActiveTab] = useState("assigned");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user.userId) {
          throw new Error("User ID not found. Please log in again.");
        }
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/driver/dashboard/${user.userId}`);
        setDashboardData(response.data);
        console.log("Dashboard Data:", response.data);

        // Auto-populate Current tab if there's an in-progress route
        if (response.data.inProgressRoutes && response.data.inProgressRoutes.length > 0) {
          const activeRoute = response.data.inProgressRoutes[0];
          if (activeRoute.optimizedSeq) {
            setCurrentSequence(activeRoute.optimizedSeq);
          }
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.userId, refreshTrigger]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const userWithLogout = { ...user, onLogout: handleLogout };


  // Handle Start Route Action
  const handleStartRoute = async (routeId, adminId) => {
    try {
      const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/route/${routeId}/start`;
      // Start route with adminId in the body as requested
      const response = await axios.patch(url, { adminId });
      console.log("Route started successfully!", response.data);

      if (response.data?.route?.optimizedSeq) {
        setCurrentSequence(response.data.route.optimizedSeq);
        // Refresh dashboard data to update assigned/in-progress lists
        setRefreshTrigger(prev => prev + 1);
      }

      toast.success("Route started successfully!");
    } catch (err) {
      console.error("Error starting route:", err);
      toast.error(err.response?.data?.message || "Failed to start route");
    }
  };

  // Handle Update Status
  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/delivery/${deliveryId}/status`;
      const response = await axios.patch(url, {
        status,
        driverId: user.userId
      });
      console.log("Status updated response:", response.data);
      toast.success(`Status updated to ${status}`);

      if (status === 'delivered') {
        // Remove from current sequence
        setCurrentSequence(prev => prev.filter(item => item.deliveryId !== deliveryId));

        // Add to completed deliveries/Past tab
        if (response.data?.delivery) {
          setCompletedDeliveries(prev => [response.data.delivery, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };


  const assignedRoutes = dashboardData?.assignedRoutes || [];
  const pastRoutes = dashboardData?.completedRoutes || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster />
      <Navbar user={userWithLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Dashboard</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'current', label: 'Current' },
              { id: 'past', label: 'Past' },
              { id: 'assigned', label: 'Assigned' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && (
          <div className="min-h-[400px]">
            {/* Assigned Tab */}
            {activeTab === 'assigned' && (
              <div className="space-y-6">
                {assignedRoutes.length > 0 ? (
                  assignedRoutes.map(route => (
                    <AssignedRouteCard
                      key={route._id}
                      route={route}
                      onStartRoute={(id) => handleStartRoute(id, route.adminId)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">No assigned routes at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Current Tab */}
            {activeTab === 'current' && (
              <div className="space-y-6">
                {currentSequence.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Routes</h3>
                    <div className="space-y-4">
                      {currentSequence.map((stop, index) => (
                        <div key={stop._id || index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{stop.locationName}</p>
                          </div>
                          <select
                            className="text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                            defaultValue="Update Status"
                            onChange={(e) => {
                              const status = e.target.value;
                              if (status !== "Update Status") {
                                handleUpdateStatus(stop.deliveryId, status.toLowerCase());
                              }
                            }}
                          >
                            <option disabled>Update Status</option>
                            <option value="in-progress">In-progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed">Failed</option>
                          </select>

                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <h3 className="text-xl font-medium text-gray-900">No Active Route Sequence</h3>
                    <p className="mt-2 text-gray-500">Start a route to see the optimized sequence here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Past Tab */}
            {activeTab === 'past' && (
              <div className="space-y-6">
                {completedDeliveries.length > 0 || pastRoutes.length > 0 ? (
                  <>
                    {/* Newly Completed Deliveries */}
                    {completedDeliveries.map(delivery => (
                      <div key={delivery._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{delivery.customerDetails?.name || 'Customer'}</h3>
                            <p className="text-sm text-gray-500">{delivery.address}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                            {delivery.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Delivered at: {new Date(delivery.deliveredAt || delivery.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}

                    {/* Historically Completed Routes (if needed) */}
                    {pastRoutes.length > 0 && (
                      <div className="mt-8 border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Historical Routes</h4>
                        <div className="text-sm text-gray-400">
                          {pastRoutes.length} completed routes from history
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <h3 className="text-xl font-medium text-gray-900">No Past Deliveries</h3>
                    <p className="mt-2 text-gray-500">Completed deliveries will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;