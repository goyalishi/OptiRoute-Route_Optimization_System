// ================= DRIVER MANAGEMENT TAB =================
import { FiUsers } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";

const DriverManagement = () => {
  const adminId = sessionStorage.getItem("userId");

  const [verifiedDrivers, setVerifiedDrivers] = useState([]);
  const [unverifiedDrivers, setUnverifiedDrivers] = useState([]);
  const [selected, setSelected] = useState(null);


  const fetchDrivers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/drivers/${adminId}`
      );

      setVerifiedDrivers(res.data.verifiedDrivers || []);
      setUnverifiedDrivers(res.data.unverifiedDrivers || []);

      if (res.data.verifiedDrivers.length > 0 && !selected) {
        setSelected(res.data.verifiedDrivers[0]);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();

    // Auto-refresh every 20  seconds → NO SOCKET.IO NEEDED
    const interval = setInterval(fetchDrivers, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 mt-6">

      {/* 🔴 Unverified Drivers Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-200">
        <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center">
          <FiUsers className="mr-2" /> Unverified Drivers ({unverifiedDrivers.length})
        </h2>

        {unverifiedDrivers.length === 0 ? (
          <p className="text-gray-500">No pending verifications 🎉</p>
        ) : (
          <ul className="space-y-3">
            {unverifiedDrivers.map((d) => (
              <li
                key={d._id}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{d.name}</p>
                  <p className="text-sm text-gray-500">{d.email}</p>
                </div>
                <button
                  onClick={() => verifyDriver(d._id, fetchDrivers)}
                  className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Verify
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🟢 Verified Drivers (Existing UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Drivers List */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300 p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <FiUsers className="mr-2 text-blue-600" />
            Drivers ({verifiedDrivers.length})
          </h2>

          <div className="divide-y">
            {verifiedDrivers.map((driver) => (
              <div
                key={driver._id}
                onClick={() => setSelected(driver)}
                className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all ${
                  selected?._id === driver._id
                    ? "bg-blue-100 border-l-4 border-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800">{driver.name}</p>
                  <p className="text-sm text-gray-500">
                    {driver.vehicleType || "Vehicle Not Assigned"}
                  </p>
                </div>
                <div
                  className="h-3 w-3 rounded-full bg-green-500"
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Details */}
        {selected ? (
          <DriverDetails selected={selected} />
        ) : (
          <div className="lg:col-span-2 bg-white p-6 rounded-xl text-gray-500">
            Select a driver to view details.
          </div>
        )}
      </div>
    </div>
  );
};

// Verify Driver Handler
const verifyDriver = async (driverId, refresh) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/verify-driver/${driverId}`
    );
    alert("Driver verified successfully!");
    refresh();
  } catch (err) {
    console.error(err);
    alert("Failed to verify driver");
  }
};

// Driver Details Component (same as before)
const DriverDetails = ({ selected }) => (
  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 p-6">
    <h3 className="text-xl font-semibold text-gray-800">{selected.name}</h3>
    <p className="text-sm text-gray-500 mb-4">{selected.email}</p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <InfoCard label="Phone" value={selected.phone || "Not Provided"} />
      <InfoCard label="Vehicle" value={selected.vehicleType || "N/A"} />
      <InfoCard label="Status" value={selected.status || "Active"} />
    </div>
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="p-4 bg-gray-50 border rounded-lg hover:bg-green-50 transition-all">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default DriverManagement;
