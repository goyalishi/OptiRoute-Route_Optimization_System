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
      }

      toast.success("Route started successfully!");
      // Switch tab to Current - REMOVED per user request
      // setActiveTab("current");
      // Trigger refresh to update UI (move from Assigned to Current)
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Error starting route:", err);
      toast.error(err.response?.data?.message || "Failed to start route");
    }
  };

  /* New states for handling UI interactions */
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [reasonModal, setReasonModal] = useState({ isOpen: false, type: '', deliveryId: '', reason: '' });

  // Handle Update Status with optional Failure Reason
  const handleUpdateStatus = async (deliveryId, status, failureReason = null) => {
    try {
      const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/delivery/${deliveryId}/status`;
      await axios.patch(url, {
        status,
        failureReason,
        driverId: user.userId
      });
      toast.success(`Status updated to ${status}`);
      setRefreshTrigger(prev => prev + 1);
      setReasonModal({ isOpen: false, type: '', deliveryId: '', reason: '' }); // Close modal if open
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle Route Completion
  const handleCompleteRoute = async (routeId) => {
    try {
      const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/driver/route/${routeId}/complete`;
      await axios.patch(url, { driverId: user.userId });
      toast.success("Route marked as completed!");
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Error completing route:", err);
      toast.error(err.response?.data?.message || "Failed to complete route");
    }
  };

  const handleReasonSubmit = () => {
    if (!reasonModal.reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    handleUpdateStatus(reasonModal.deliveryId, reasonModal.type, reasonModal.reason);
  };

  const toggleRouteExpansion = (routeId) => {
    setExpandedRouteId(prev => prev === routeId ? null : routeId);
  };


  const allRoutes = dashboardData?.assignedRoutes || [];
  const assignedRoutes = allRoutes.filter(r => r.status === 'assigned');

  // Use completedRoutes from API for Past Tab
  const pastRoutes = dashboardData?.completedRoutes || [];

  const inProgressRoutes = dashboardData?.inProgressRoutes || [];

  // Filter current sequence into categories (Helper function)
  const getCategorizedDeliveries = (sequence) => {
    return {
      active: sequence.filter(item => !['delivered', 'cancelled'].includes(item.status)),
      delivered: sequence.filter(item => item.status === 'delivered'),
      cancelled: sequence.filter(item => item.status === 'cancelled')
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster />
      <Navbar user={userWithLogout} />

      {/* Reason Modal */}
      {reasonModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 capitalize">
              {reasonModal.type === 'cancelled' ? 'Cancellation Reason' : 'Failure Reason'}
            </h3>
            <textarea
              className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Please specify the reason..."
              rows={3}
              value={reasonModal.reason}
              onChange={(e) => setReasonModal(prev => ({ ...prev, reason: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReasonModal({ isOpen: false, type: '', deliveryId: '', reason: '' })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
                {inProgressRoutes.length > 0 ? (
                  inProgressRoutes.map((route) => {
                    const isExpanded = expandedRouteId === route._id;
                    const deliveries = route.deliveryPoints || [];
                    const isRouteComplete = deliveries.length > 0 && deliveries.every(d => ['delivered', 'failed', 'cancelled'].includes(d.status));

                    return (
                      <div key={route._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 transition-all duration-200">
                        {/* Route Card Header */}
                        <div
                          className="p-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                          onClick={() => toggleRouteExpansion(route._id)}
                        >
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              Route #{route._id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {deliveries.length} Deliveries • {new Date(route.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            {isRouteComplete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteRoute(route._id);
                                }}
                                className="px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-md hover:bg-green-700 shadow-sm transition-colors"
                              >
                                Complete Route
                              </button>
                            )}
                            <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                        </div>

                        {/* Deliveries List */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                            {deliveries.map((delivery, index) => (
                              <div key={delivery._id || index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                                        {index + 1}
                                      </span>
                                      <h4 className="font-semibold text-gray-900">{delivery.address}</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-8">
                                      {delivery.customerDetails?.name} • {delivery.customerDetails?.phone}
                                    </p>
                                    {/* Status Badge */}
                                    <div className="ml-8 mt-2">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                          delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            delivery.status === 'failed' ? 'bg-orange-100 text-orange-800' :
                                              delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {delivery.status}
                                      </span>
                                      {delivery.failureReason && (
                                        <span className="text-xs text-red-500 ml-2">({delivery.failureReason})</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2 md:justify-end">
                                    {/* Status: Assigned (or default/pending) */}
                                    {(delivery.status === 'assigned' || delivery.status === 'pending') && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(delivery._id || delivery.deliveryId, 'in-progress')} // Check ID field mapping
                                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                        >
                                          Start
                                        </button>
                                        <button
                                          onClick={() => setReasonModal({
                                            isOpen: true,
                                            type: 'cancelled',
                                            deliveryId: delivery._id || delivery.deliveryId,
                                            reason: ''
                                          })}
                                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    )}

                                    {/* Status: In-Progress */}
                                    {delivery.status === 'in-progress' && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(delivery._id || delivery.deliveryId, 'delivered')}
                                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                                        >
                                          Delivered
                                        </button>
                                        <button
                                          onClick={() => setReasonModal({
                                            isOpen: true,
                                            type: 'failed',
                                            deliveryId: delivery._id || delivery.deliveryId,
                                            reason: ''
                                          })}
                                          className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600"
                                        >
                                          Failed
                                        </button>
                                      </>
                                    )}

                                    {/* Final Statuses - No Actions */}
                                    {['delivered', 'cancelled', 'failed'].includes(delivery.status) && (
                                      <span className="text-sm text-gray-400 italic">No further actions</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <h3 className="text-xl font-medium text-gray-900">No Active Routes</h3>
                    <p className="mt-2 text-gray-500">Start a route from Selected tab to see it here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Past Tab */}
            {activeTab === 'past' && (
              <div className="space-y-6">
                {pastRoutes.length > 0 ? (
                  pastRoutes.map(route => {
                    const isExpanded = expandedRouteId === route._id;
                    const deliveries = route.deliveryPoints || [];

                    return (
                      <div key={route._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-200">
                        {/* Route Card Header */}
                        <div
                          className="p-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                          onClick={() => toggleRouteExpansion(route._id)}
                        >
                          <div>
                            <h3 className="font-bold text-gray-900">Route #{route._id.slice(-6)}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Completed on: {new Date(route.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                              {route.status}
                            </span>
                            <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                        </div>

                        {/* Deliveries List (Read-Only) */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                            {deliveries.length > 0 ? (
                              deliveries.map((delivery, index) => (
                                <div key={delivery._id || index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                                          {index + 1}
                                        </span>
                                        <h4 className="font-semibold text-gray-900">{delivery.address}</h4>
                                      </div>
                                      <p className="text-sm text-gray-600 ml-8">
                                        {delivery.customerDetails?.name}
                                      </p>

                                      {/* Status Badge & Reason */}
                                      <div className="ml-8 mt-2 flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                          ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                              delivery.status === 'failed' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                          {delivery.status}
                                        </span>
                                        {/* Show Reason for Cancelled/Failed */}
                                        {['cancelled', 'failed'].includes(delivery.status) && delivery.failureReason && (
                                          <span className="text-xs text-red-600 font-medium">
                                            Reason: {delivery.failureReason}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500 italic">No delivery details available.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <h3 className="text-xl font-medium text-gray-900">No Past Routes</h3>
                    <p className="mt-2 text-gray-500">Completed routes will appear here.</p>
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