import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiError.js";
import Driver from "../models/driver.model.js";
import Vehicle from "../models/vehicle.model.js";

const MAX_STOPS_BY_TYPE = {
  bike: 15,
  van: 25,
  tempo: 35,
  truck: 45,
};

const getFreeDrivers = async (adminId) => {
  if (!adminId) throw new ApiError(400, "adminId is required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(404, "Admin not found");

  const driverIds = Array.isArray(admin.driverIds) ? admin.driverIds : [];
  if (driverIds.length === 0) return { drivers: [] };

  // Fetch free drivers & populate their vehicles
  const freeDrivers = await Driver.find({
    _id: { $in: driverIds },
    status: "free",
    verified: true,
  }).populate({
    path: "vehicleId",
    match: { status: "free" },
  });

  console.log(freeDrivers);
  const validDrivers = freeDrivers.filter(
    (d) => d.vehicleId && d.vehicleId.capacity
  );

  return { drivers: validDrivers };
};

const selectDrivers = (freeDrivers, geocodedPoints) => {
  const totalLoad = geocodedPoints.reduce((sum, d) => sum + d.weight, 0);

  freeDrivers.sort((a, b) => b.vehicleId.capacity - a.vehicleId.capacity);

  let capacityCovered = 0;
  let totalStopCapacity = 0;
  const selectedDrivers = [];

  for (const driver of freeDrivers) {
    const type = driver.vehicleId.type.toLowerCase();
    const maxStops = MAX_STOPS_BY_TYPE[type] || 20; // fallback

    selectedDrivers.push(driver);
    capacityCovered += driver.vehicleId.capacity;
    totalStopCapacity += maxStops;

    if (
      capacityCovered >= totalLoad &&
      totalStopCapacity >= geocodedPoints.length
    ) {
      break;
    }
  }

  if (capacityCovered < totalLoad) {
    throw new ApiError(
      400,
      "Insufficient total vehicle capacity to cover all deliveries."
    );
  }

  if (totalStopCapacity < geocodedPoints.length) {
    throw new ApiError(
      400,
      "Insufficient stop capacity — too many deliveries for available vehicles."
    );
  }

  return selectedDrivers;
};

export { getFreeDrivers, selectDrivers };
