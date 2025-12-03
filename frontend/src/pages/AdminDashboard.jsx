import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FiMapPin, FiTruck, FiUploadCloud, FiUsers } from "react-icons/fi";
import axios from "axios";
import Papa from "papaparse";
import DriverManagement from "../components/DriverManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("optimize");
  const [csvFile, setCsvFile] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [depotAddress, setDepotAddress] = useState("");

  const user = {
    name: sessionStorage.getItem("username") ,
    role: sessionStorage.getItem("role"),
    id: sessionStorage.getItem("userId"),
    onLogout: () => {
      sessionStorage.clear();
      alert("Logged out successfully!");
      window.location.href = "/";
    },
  };

  // ✅ Handle CSV selection and parsing
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row) => ({
          name: row.Name || row.name,
          address: row.Address || row.address,
          phone: row.Phone || "",
          weight: row.Weight || 1,
          // Add more fields as needed
        }));
        setDeliveries(parsed);
        alert(`Parsed ${parsed.length} deliveries successfully!`);
      },
    });
  };

  // ✅ Handle Optimization request
  const handleOptimize = async () => {
    if (!csvFile) return alert("Please select a CSV file first.");
    if (!depotAddress.trim()) return alert("Please enter a depot address.");

    const data = {
      adminId: user.id,
      depot: { address: depotAddress.trim() },
      deliveries: deliveries,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/optimize`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", response.data);
      alert("Optimization successful! Check console for route details.");
    } catch (error) {
      console.error("Optimization error:", error);
      alert("Error optimizing routes. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 transition-all duration-300">
      <Navbar user={user} />

      {/* Tabs Header aligned left */}
      <div className="flex justify-start mt-6 ml-8">
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 to-green-100 px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
          {[
            { id: "optimize", label: "Optimize Routes", icon: "⚡" },
            { id: "drivers", label: "Driver Management", icon: "👨‍✈️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-700 hover:bg-white/80 hover:text-blue-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {activeTab === "optimize" ? (
          <OptimizeRoutes
            csvFile={csvFile}
            handleCsvUpload={handleCsvUpload}
            handleOptimize={handleOptimize}
            depotAddress={depotAddress}
            setDepotAddress={setDepotAddress}
          />
        ) : (
          <DriverManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// ================= OPTIMIZE ROUTES TAB =================
const OptimizeRoutes = ({
  csvFile,
  handleCsvUpload,
  handleOptimize,
  depotAddress,
  setDepotAddress,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      {/* Left Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Upload CSV Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiMapPin className="mr-2 text-blue-600" /> Delivery Addresses
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload a CSV file containing delivery locations with columns:
            <br />
            <span className="text-gray-600 font-medium">
              Name, Address, Phone, Weight
            </span>
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
            <FiUploadCloud className="text-4xl mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-3">
              Drag and drop your CSV file here
              <br /> or click the button below to browse.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id="csvInput"
            />
            <label
              htmlFor="csvInput"
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              Choose File
            </label>
            {csvFile && (
              <p className="mt-2 text-sm text-gray-600">{csvFile.name}</p>
            )}
          </div>
        </div>

        {/* Depot Address Input (same design container) */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTruck className="mr-2 text-green-600" /> Depot Point
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Enter the starting depot address for route optimization.
          </p>
          <input
            type="text"
            placeholder="e.g., Main Warehouse, Delhi"
            value={depotAddress}
            onChange={(e) => setDepotAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Optimize Button */}
        <div className="flex justify-end">
          <button
            onClick={handleOptimize}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            ⚡ Optimize Route
          </button>
        </div>
      </div>

      {/* Summary Section (unchanged) */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Optimization Summary
        </h3>
        <div className="space-y-4">
          <SummaryCard
            title="Delivery Locations"
            value={csvFile ? "1 CSV selected" : "0"}
            color="text-blue-600"
          />
          <SummaryCard
            title="Depot Point"
            value={depotAddress ? depotAddress : "Not Entered"}
            color="text-green-600"
          />
          <SummaryCard
            title="Optimization Status"
            value="⚠️ Pending Setup"
            color="text-yellow-600"
          />
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, color }) => (
  <div className="p-4 bg-gray-50 border rounded-lg hover:bg-blue-50 transition">
    <h4 className="text-sm font-medium text-gray-600">{title}</h4>
    <p className={`text-lg font-semibold mt-1 ${color}`}>{value}</p>
  </div>
);


