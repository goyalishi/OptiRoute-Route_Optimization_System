import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiPackage,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import axios from "axios";

const DriverDetailsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const driver = state?.driver;

    const [activeTab, setActiveTab] = useState("current");
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/driver-routes/${id}`
                );

                const routes = response.data.routes || [];

                // Filter routes for this specific driver
                const driverRoutes = routes.filter(r => {
                    const rDriverId = typeof r.driverId === 'object' ? r.driverId._id : r.driverId;
                    return rDriverId === id;
                });

                const allDeliveries = driverRoutes.flatMap(route =>
                    (route.deliveryPoints || []).map(dp => ({
                        id: dp._id,
                        address: dp.address || dp.locationName,
                        customer: dp.customerDetails?.name || "Unknown Customer",
                        phone: dp.customerDetails?.phone || "N/A",
                        status: dp.status || "assigned", // Default to assigned if status is missing
                        weight: "N/A",
                        time: "10:00 AM"
                    }))
                );

                setDeliveries(allDeliveries);
            } catch (error) {
                console.error("Error fetching data:", error);
                setDeliveries([]);
            } finally {
                setLoading(false);
            }
        };

        if (state?.driver || id) {
            fetchRoutes();
        }
    }, [id, state]);

    const markAsComplete = (deliveryId) => {
        setDeliveries((prev) =>
            prev.map((d) =>
                d.id === deliveryId ? { ...d, status: "delivered" } : d
            )
        );
        alert("Delivery marked as delivered!");
    };

    if (state?.driver || id) {
      fetchRoutes();
    }
    const user = {
        name: sessionStorage.getItem("username"),
        role: sessionStorage.getItem("role"),
        id: sessionStorage.getItem("userId"),
        onLogout: () => {
            sessionStorage.clear();
            alert("Logged out successfully!");
            window.location.href = "/";
        },
    };
    const currentDeliveries = deliveries.filter((d) =>
        ["assigned", "in-progress"].includes(d.status)
    );
    // console.log(currentDeliveries);
    const pastDeliveries = deliveries.filter((d) =>
        ["delivered", "completed"].includes(d.status)
    );

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Driver Not Found
          </h2>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  const user = {
    name: sessionStorage.getItem("username"),
    role: sessionStorage.getItem("role"),
    id: sessionStorage.getItem("userId"),
    onLogout: () => {
      sessionStorage.clear();
      alert("Logged out successfully!");
      window.location.href = "/";
    },
  };

  const currentDeliveries = deliveries.filter(
    (d) => d.status === "assigned" || d.status === "in-progress",
  );
  const pastDeliveries = deliveries.filter((d) => d.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{delivery.address}</h3>
                <p className="text-sm text-gray-500 mb-1">Customer: {delivery.customer} • {delivery.phone}</p>

            </div>
          </div>
        </div>

        {isCurrent ? (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${delivery.status === 'in-progress'
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                {delivery.status.replace('-', ' ')}
            </div>
        ) : (
            <div className="flex items-center gap-2 text-green-600 font-medium px-4 py-2 bg-green-50 rounded-lg shrink-0 border border-green-200">
                <FiCheckCircle /> Completed
            </div>
        )}
      </div>
    </div>
  );
};

const DeliveryCard = ({ delivery, onComplete, isCurrent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex items-start gap-4">
      <div
        className={`p-3 rounded-full ${isCurrent ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
      >
        <FiPackage className="text-xl" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {delivery.address}
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Customer: {delivery.customer} • {delivery.phone}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FiPackage /> {delivery.weight}
          </span>
          <span className="flex items-center gap-1">
            <FiClock /> {delivery.time}
          </span>
        </div>
      </div>
    </div>

    {isCurrent ? (
      <button
        onClick={onComplete}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors shrink-0"
      >
        Mark Complete
      </button>
    ) : (
      <div className="flex items-center gap-2 text-green-600 font-medium px-4 py-2 bg-green-50 rounded-lg shrink-0">
        <FiCheckCircle /> Completed
      </div>
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
      <FiPackage className="text-xl" />
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default DriverDetailsPage;
