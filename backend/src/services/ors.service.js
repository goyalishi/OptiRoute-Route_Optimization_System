import axios from "axios";
import { ApiError } from "../utils/apiError.js";

const ORS_BASE_URL = "https://api.openrouteservice.org/optimization";

async function optimizeRouteWithORS(
  depotLocation,
  geocodedPoints,
  drivers
) {
  try {
    const jobIdMap = {}; // orsJobId -> geocodedPoint

    const jobs = geocodedPoints.map((point, index) => {
      const orsJobId = index + 1;
      jobIdMap[orsJobId] = point;
      return {
        id: index + 1,
        location: [point.lng, point.lat],
        service: 300,
        amount: [point.weight],
      };
    });

    console.log(jobIdMap);

    const vehicleIdMap = {}; //orsVehicleId -> realDriverId (string)

    const vehicles = drivers.map((driver, index) => {
      const orsVehicleId = index + 1;
      vehicleIdMap[orsVehicleId] = driver._id.toString();

      return {
        id: orsVehicleId,
        start: [depotLocation.lng, depotLocation.lat],
        capacity: [driver.vehicleId.capacity],
        profile:
          driver.vehicleId.type.toLowerCase() === "bike"
            ? "cycling-regular"
            : "driving-car",
      };
    });

    console.log(vehicleIdMap);

    const payload = {
      jobs,
      vehicles,
    };

    const response = await axios.post(ORS_BASE_URL, payload, {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    if (!response?.data) {
      throw new ApiError(500, "No response from ORS API");
    }

    if (response?.data?.unassigned.length === geocodedPoints.length) {
      throw new ApiError(
        400,
        "ORS could not assign any jobs to the vehicles. Please check vehicle capacities and job amounts."
      );
    } else if (response?.data?.unassigned.length > 0) {
      console.warn(
        "Warning: Some jobs were unassigned by ORS:",
        response.data.unassigned
      );
    }

    console.log("ORS response", response.data);

    return { response: response.data, jobIdMap, vehicleIdMap };
  } catch (error) {
    console.error(
      "ORS Optimization Error:",
      error?.response?.data || error.message
    );

    const orsMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "ORS optimization failed";

    throw new ApiError(500, orsMessage);
  }
}

export { optimizeRouteWithORS };
