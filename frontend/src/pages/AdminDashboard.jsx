import React, { useState, useEffect } from "react";
import axios from "axios";
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

    // Fetch dummy data for Routes & Drivers tabs
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar user={user} />

            {/* Tabs Section */}
            <div className="flex ml-14 mt-6">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-gray-200 shadow-md py-2 px-3 text-black w-fit">
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "routes", label: "Routes", icon: "🛣️" },
                        { id: "drivers", label: "Drivers", icon: "👥" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-3xl text-base font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-700 hover:bg-white/70 hover:text-black"
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
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Welcome back, Admin 👋
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
                                color="bg-purple-100 text-purple-600"
                            />
                            <StatCard
                                title="Avg Delivery Time"
                                value="23 min"
                                icon="⏱️"
                                color="bg-yellow-100 text-yellow-600"
                            />
                        </div>

                        {/* Route Creation & Map */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: Create Route */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border">
                                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                                    Create New Route
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Enter delivery addresses and optimize the route
                                </p>
                                <textarea
                                    className="w-full border rounded-lg p-3 text-sm mb-4 resize-none focus:ring-2 focus:ring-blue-400"
                                    rows={4}
                                    placeholder={`Enter addresses (one per line)\n123 Main St, City, State\n456 Park Ave, City, State`}
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4 transition">
                                    Load Sample Addresses
                                </button>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Optimization Criteria
                                    </label>
                                    <select className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400">
                                        <option>Shortest Distance</option>
                                        <option>Fastest Route</option>
                                        <option>Balanced Load</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Assign to Driver
                                    </label>
                                    <select className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400">
                                        <option>Select Driver</option>
                                        <option>Driver A</option>
                                        <option>Driver B</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right: Map Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border flex flex-col items-center justify-center transition-transform hover:scale-[1.01]">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                    Live Route Map
                                </h2>
                                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center text-gray-500 font-medium">
                                    Map Preview Coming Soon 🗺️
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ROUTES TAB */}
                {activeTab === "routes" && (
                    <div>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            All Routes
                        </h2>
                        {loading ? (
                            <p className="text-gray-500">Loading routes...</p>
                        ) : (
                            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border">
                                <table className="w-full text-left">
                                    <thead className="bg-blue-600 text-white">
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
                                                className="border-b hover:bg-blue-50 transition"
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
                )}

                {/*  DRIVERS TAB */}
                {activeTab === "drivers" && (
                    <div>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            Driver Details
                        </h2>
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
                                        <p className="text-gray-600 text-sm mb-1">
                                            ✉️ {driver.email}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-1">
                                            📍 {driver.address?.city}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            🏢 {driver.company?.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-5 shadow-lg border hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
            <div className={`${color} rounded-full p-2 text-xl`}>{icon}</div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

export default AdminDashboard;
