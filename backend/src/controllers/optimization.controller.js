import mongoose from "mongoose";
import DeliveryPoint from "../models/deliveryPoint.model.js";
import Driver from "../models/driver.model.js";
import Route from "../models/route.model.js";
import { geocodeAddress } from "../services/geocode.service.js";
import { getFreeDrivers , selectDrivers } from "../utils/driverSelectionHelper.js";
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
  if (!adminId || !deliveries || deliveries.length === 0 || !depot || !depot.address) {
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

    // Geocode all deliveries in parallel 
    const geoPromises = deliveries.map((d) => geocodeAddress(d.address));
    const geos = await Promise.all(geoPromises);
    const geocodedPoints = deliveries.map((d, i) => ({
      address: d.address,
      lat: geos[i].lat,
      lng: geos[i].lng,
      customerDetails: { name: d.name, phone: d.phone },
      weight: Number(d.weight) || 25,
    }));

    console.log(geocodedPoints);

    // Fetching free drivers for this admin
     const freeDriversRes = await getFreeDrivers(adminId);
    const freeDrivers = freeDriversRes.drivers;

    if (!freeDrivers.length) {
      throw new ApiError(400, "No free drivers available for route optimization.");
    }

    const selectedDrivers = selectDrivers(freeDrivers, geocodedPoints);
    console.log("Selected Drivers:", selectedDrivers);

    return res.status(200).json({
      message: "Route optimization successful",
      freeDrivers: freeDrivers,
      selectedDrivers: selectedDrivers,
      deliveries: geocodedPoints,
    });

  } catch (error) {
    console.error("Optimization error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
