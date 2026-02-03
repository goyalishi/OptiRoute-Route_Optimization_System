import DeliveryPoint from "../models/deliveryPoint.model.js";
import { geocodeAddress } from "../services/geocode.service.js";
import {
  getFreeDrivers,
  selectDrivers,
} from "../utils/driverSelectionHelper.js";
import { optimizeRouteWithORS } from "../services/ors.service.js";
import { createAndPersistRoutes } from "../utils/routeCreationHelper.js";
import { ApiError } from "../utils/apiError.js";

async function getDepotInfo(depot) {
  if (typeof depot === "string" && depot.trim() !== "") {
    const depotPoint = await geocodeAddress(depot);
    return depotPoint;
  }
  return null;
}

export const optimizeDeliveryRoute = async (req, res) => {
  const { depot, adminId, deliveries } = req.body;
  if (
    !adminId ||
    !deliveries ||
    deliveries.length === 0 ||
    !depot ||
    !depot.address
  ) {
    return res
      .status(400)
      .json({ message: "adminId, depot and deliveries are required." });
  }

  try {
    //  Get depot coords
    let depotLocation = await getDepotInfo(depot.address);
    if (!depotLocation) {
      return res.status(400).json({ message: "Invalid depot information." });
    }

    // Create delivery points in DB to get real MongoDB IDs
    const deliveryPointsToCreate = await Promise.all(
      deliveries.map(async (d) => {
        const geo = await geocodeAddress(d.address);
        return {
          address: d.address,
          lat: geo.lat,
          lng: geo.lng,
          customerDetails: { name: d.name, phone: d.phone },
          weight: Number(d.weight) || 25,
          status: "pending",
        };
      })
    );

    const createdDeliveryPoints = await DeliveryPoint.insertMany(
      deliveryPointsToCreate
    );
    console.log(`✅ Created ${createdDeliveryPoints.length} delivery points`);

    //  Prepare geocoded points with real MongoDB IDs for ORS
    const geocodedPoints = createdDeliveryPoints.map((dp) => ({
      tempId: dp._id.toString(), 
      address: dp.address,
      lat: dp.lat,
      lng: dp.lng,
      customerDetails: dp.customerDetails,
      weight: dp.weight,
    }));

    // Fetching free drivers for this admin
    const freeDriversRes = await getFreeDrivers(adminId);
    const freeDrivers = freeDriversRes.drivers;
    // console.log(freeDrivers);

    if (!freeDrivers.length) {
      throw new ApiError(
        400,
        "No free drivers available for route optimization."
      );
    }

    const selectedDrivers = selectDrivers(freeDrivers, geocodedPoints);
    console.log("Selected Drivers:", selectedDrivers);

    // Call ORS with numeric IDs + id maps
    let response, jobIdMap, vehicleIdMap;
    try {
      const orsResult = await optimizeRouteWithORS(
        depotLocation,
        geocodedPoints,
        selectedDrivers
      );
      response = orsResult.response;
      jobIdMap = orsResult.jobIdMap;
      vehicleIdMap = orsResult.vehicleIdMap;
    } catch (orsError) {
      // Rollback: Delete all created delivery points if ORS fails
      const deliveryPointIds = createdDeliveryPoints.map((dp) => dp._id);
      await DeliveryPoint.deleteMany({ _id: { $in: deliveryPointIds } });
      console.warn(
        ` Rolled back ${deliveryPointIds.length} delivery points due to ORS error`
      );
      throw orsError;
    }

    //  Create and persist routes using id maps
    const { routes, unassignedDeliveries, summary } = await createAndPersistRoutes(
      response,
      jobIdMap,
      vehicleIdMap,
      createdDeliveryPoints,
      adminId
    );

    return res.status(200).json({
      message: "Route optimization successful",
      routes,
      unassignedDeliveries,
      summary,
    });
  } catch (error) {
    console.error("Optimization error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
