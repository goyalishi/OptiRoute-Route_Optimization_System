import axios from "axios";
import Bottleneck from "bottleneck";
import { ApiError } from "../utils/apiError.js";

const limiter = new Bottleneck({ minTime: 250 }); // ~4 req/s

export const geocodeAddress = async (address) => {
  const apiKey = process.env.GEOAPIFY_KEY;
  if (!apiKey) {
    throw new ApiError(500, "Geocoding API key is not configured");
  }

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&apiKey=${apiKey}`;

  let response;
  try {
    response = await limiter.schedule(() => axios.get(url));
  } catch (err) {
    throw new ApiError(502, "Failed to call Geocoding API", [
      { message: err.message },
    ]);
  }

  const res = response?.data;
//   console.log(res);

  const feature = res?.features?.[0] || null;
//   console.log(feature);

    if (!feature) { 
      throw new ApiError(404, `No geocoding result for address: ${address}`);
    }

    let lat, lng;
    if (
      feature.properties &&
      feature.properties.lat != null &&
      feature.properties.lon != null
    ) {
      lat = feature.properties.lat;
      lng = feature.properties.lon;
    } else if (feature.geometry && Array.isArray(feature.geometry.coordinates)) {
      [lng, lat] = feature.geometry.coordinates;
    } else {
      throw new ApiError(502, "Unexpected geocoding response format");
    }

    if (lat == null || lng == null) {
      throw new ApiError(404, `No coordinates found for address: ${address}`);
    }

return { lat, lng };
};
