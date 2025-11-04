import mongoose from "mongoose";
import DeliveryPoint from "../models/deliveryPoint.model.js";
import Driver from "../models/driver.model.js";
import Route from "../models/route.model.js";
import { geocodeAddress } from "../services/geocode.service.js";

function getDepotInfo(depot) {
  if (depot && typeof depot === "object") {
    const lat = depot.lat;
    const lng = depot.lng;
    const address = depot.address;
    if (lat != null && lng != null && address !== "") return {lng, lat, address};
  }
  return null;
}

export const optimizeDeliveryRoute = async (req, res) => {
  const { depot, adminId, deliveries } = req.body;
  if (!adminId || !deliveries || deliveries.length === 0) {
    return res
      .status(400)
      .json({ message: "adminId and deliveries are required." });
  }

  try {
    //  Get depot coords 
    let depotLocation = getDepotInfo(depot);
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
      weight: Number(d.weight) || 1,
    }));

    console.log(geos);
    return res.status(200).json({ geos, geocodedPoints, message: "Geocoding successful" });

  } catch (error) {
    console.error("Optimization error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
