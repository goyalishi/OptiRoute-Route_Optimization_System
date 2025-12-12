import { FiUsers } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";

const DriverManagement = ({ drivers, refresh }) => {
  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const verifiedDrivers = drivers.verifiedDrivers || [];
  const unverifiedDrivers = drivers.unverifiedDrivers || [];

  useEffect(() => {
    if (!selected && verifiedDrivers.length > 0) {
      setSelected(verifiedDrivers[0]);
    }
  }, [verifiedDrivers]);

  return (
    <div className="space-y-8 mt-6">
      {/* Unverified Drivers */}
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
                className="p-3 bg-red-50 border rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-gray-500">{d.email}</p>
                </div>

                <button
                  onClick={() =>
                    verifyDriver(d._id, refresh, setLoadingId)
                  }
                  disabled={loadingId === d._id}
                  className={`px-4 py-1 rounded-md text-white ${
                    loadingId === d._id
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingId === d._id ? "Verifying..." : "Verify"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Verified Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <FiUsers className="mr-2 text-blue-600" />
            Drivers ({verifiedDrivers.length})
          </h2>

          <div className="divide-y">
            {verifiedDrivers.map((driver) => (
              <div
                key={driver._id}
                onClick={() => setSelected(driver)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selected?._id === driver._id
                    ? "bg-blue-100 border-l-4 border-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-500">
                    {driver.vehicleType || "Vehicle Not Assigned"}
                  </p>
                </div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            ))}
          </div>
        </div>

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

// Verify Driver
const verifyDriver = async (driverId, refresh, setLoadingId) => {
  try {
    setLoadingId(driverId);
    await axios.patch(
      `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/verify-driver/${driverId}`
    );
    alert("Driver verified successfully!");
    refresh();
  } catch (err) {
    alert("Failed to verify driver");
  } finally {
    setLoadingId(null);
  }
};

// Driver Details
const DriverDetails = ({ selected }) => (
  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6">
    <h3 className="text-xl font-semibold">{selected.name}</h3>
    <p className="text-sm mb-4">{selected.email}</p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InfoCard label="Phone" value={selected.phone || "Not Provided"} />
      <InfoCard label="Vehicle" value={selected.vehicleType || "N/A"} />
      <InfoCard label="Status" value={selected.status || "Active"} />
    </div>
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="p-4 bg-gray-50 border rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default DriverManagement;
