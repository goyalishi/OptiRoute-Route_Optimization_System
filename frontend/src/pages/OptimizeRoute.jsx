import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MapPin, Truck, PlusCircle, FileSpreadsheet, Zap } from "lucide-react";

const OptimizeRoutePage = () => {
    const user = { name: "Hariom Sharma", role: "admin" };

    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [fleet, setFleet] = useState([]);
    const [vehicleType, setVehicleType] = useState("");
    const [capacity, setCapacity] = useState("");
    const [vehicleCount, setVehicleCount] = useState(0);
    const [totalCapacity, setTotalCapacity] = useState(0);

    const addAddress = () => {
        if (newAddress.trim()) {
            setAddresses([...addresses, newAddress]);
            setNewAddress("");
        }
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const lines = event.target.result.split("\n").map((line) => line.trim());
            setAddresses([...addresses, ...lines.filter((a) => a)]);
        };
        reader.readAsText(file);
    };

    const addVehicle = () => {
        if (vehicleType && capacity > 0) {
            const newFleet = [...fleet, { type: vehicleType, capacity: Number(capacity) }];
            setFleet(newFleet);
            setVehicleType("");
            setCapacity("");
            setVehicleCount(newFleet.length);
            setTotalCapacity(newFleet.reduce((sum, v) => sum + v.capacity, 0));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <Navbar user={user} />

            <div className="p-10 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-wide">
                    🧭 Route Optimization Dashboard
                </h1>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Address Section */}
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-transform hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="text-blue-600" /> Delivery Addresses
                        </h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="Enter delivery address"
                                className="border rounded-xl p-2 flex-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <button
                                onClick={addAddress}
                                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1 hover:scale-105 transition"
                            >
                                <PlusCircle size={18} /> Add
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-4 text-sm bg-gradient-to-r from-blue-50 via-white to-blue-100 p-3 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
                            <label className="font-medium text-gray-800 flex items-center gap-2">
                                <FileSpreadsheet className="text-blue-600" size={18} />
                                <span>Upload Addresses (CSV)</span>
                            </label>

                            <label className="relative cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-200">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <FileSpreadsheet size={16} /> Choose File
                                </span>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                        </div>

                        <div className="border rounded-xl h-44 overflow-y-scroll p-3 bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
                            {addresses.length === 0 ? (
                                <p className="text-gray-400 text-center mt-6">No addresses added yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {addresses.map((addr, i) => (
                                        <li
                                            key={i}
                                            className="text-gray-700 bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:bg-blue-50 transition"
                                        >
                                            📍 {addr}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Fleet Section */}
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-transform hover:-translate-y-1">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Truck className="text-green-600" /> Fleet Information
                        </h2>

                        <div className="flex gap-2 mb-4">
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="border rounded-xl p-2 flex-1 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                            >
                                <option value="">Select Vehicle Type</option>
                                <option value="Two Wheeler">🛵 Two Wheeler</option>
                                <option value="Mini Van">🚐 Mini Van</option>
                                <option value="Medium Truck">🚛 Medium Truck</option>
                                <option value="Large Truck">🚚 Large Truck</option>
                                <option value="Electric Vehicle">⚡ Electric Vehicle</option>
                            </select>

                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="Capacity (kg)"
                                className="border rounded-xl p-2 w-28 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                            />

                            <button
                                onClick={addVehicle}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-1 hover:scale-105 transition"
                            >
                                <PlusCircle size={18} /> Add
                            </button>
                        </div>

                        <div className="border rounded-xl h-44 overflow-y-scroll p-3 bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
                            {fleet.length === 0 ? (
                                <p className="text-gray-400 text-center mt-6">No vehicles added yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {fleet.map((v, i) => (
                                        <li
                                            key={i}
                                            className="text-gray-700 bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:bg-green-50 transition"
                                        >
                                            🚚 {v.type} — <span className="font-medium">Capacity:</span> {v.capacity} kg
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-700 bg-white/70 rounded-xl p-3 border">
                            <p>
                                <strong>Total Vehicles:</strong> {vehicleCount}
                            </p>
                            <p>
                                <strong>Total Capacity:</strong> {totalCapacity} kg
                            </p>
                        </div>
                    </div>
                </div>

                {/* Optimize Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => alert('Optimization triggered! 🚀')}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white px-10 py-4 rounded-2xl shadow-xl font-semibold text-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                    >
                        <Zap size={22} /> Optimize Route
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptimizeRoutePage;
