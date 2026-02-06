/**
 * Generate Google Maps navigation link for a route
 * @param {Array} optimizedSeq - Array of delivery points with lat/lng
 * @param {String} travelMode - driving, walking, bicycling, or transit
 * @returns {String} - Google Maps URL
 */
export const generateGoogleMapsLink = (
  optimizedSeq,
  travelMode = "driving"
) => {
  if (!optimizedSeq || optimizedSeq.length === 0) {
    return null;
  }

  const formatLocation = (point) => {
    if (point?.locationName) {
      return encodeURIComponent(point.locationName);
    }

    if (point?.lat != null && point?.lng != null) {
      return `${point.lat},${point.lng}`;
    }

    return null;
  };

  // Start with the first location as origin
  const origin = formatLocation(optimizedSeq[0]);

  // Last location as destination
  const destination = formatLocation(optimizedSeq[optimizedSeq.length - 1]);

  if (!origin || !destination) {
    return null;
  }

  // All middle points as waypoints (Google Maps supports up to 23 waypoints)
  const waypoints = optimizedSeq
    .slice(1, -1)
    .map((point) => formatLocation(point))
    .filter(Boolean)
    .join("|");

  // Build the URL
  let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

  if (waypoints) {
    mapsUrl += `&waypoints=${waypoints}`;
  }

  // Add travel mode
  if (travelMode) {
    mapsUrl += `&travelmode=${travelMode}`;
  }

  return mapsUrl;
};
