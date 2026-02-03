import Route from "../models/route.model.js";
import DeliveryPoint from "../models/deliveryPoint.model.js";

/**
 * Creates routes from ORS response using id maps
 * @param {Object} orsResponse - Response from ORS API
 * @param {Object} jobIdMap - Maps ORS job ID to MongoDB delivery point ID
 * @param {Object} vehicleIdMap - Maps ORS vehicle ID to MongoDB driver ID
 * @param {Array} createdDeliveryPoints - Array of created delivery point documents
 * @param {String} adminId - Admin ID
 * @returns {Object} - { routes: populated routes, summary }
 */
export const createAndPersistRoutes = async (
  orsResponse,
  jobIdMap,
  vehicleIdMap,
  createdDeliveryPoints,
  adminId
) => {
  const routesToCreate = orsResponse.routes.map((route) => {
    const driverId = vehicleIdMap[route.vehicle];
    const optimizedSeq = [];
    const deliveryPointIds = [];

    route.steps.forEach((step) => {
      if (step.type === "job" && step.job) {
        const deliveryPointId = jobIdMap[step.job];
        const deliveryPoint = createdDeliveryPoints.find(
          (dp) => dp._id.toString() === deliveryPointId
        );

        if (deliveryPoint) {
          optimizedSeq.push({
            deliveryId: deliveryPoint._id,
            locationName: deliveryPoint.address,
            lat: deliveryPoint.lat,
            lng: deliveryPoint.lng,
          });
          deliveryPointIds.push(deliveryPoint._id);
        }
      }
    });

    return {
      adminId,
      driverId,
      optimizedSeq,
      deliveryPoints: deliveryPointIds,
      totalDistance: route.distance,
      totalTime: route.duration,
      travelMode: route.profile === "cycling-regular" ? "cycling" : "driving",
      status: "pending",
    };
  });

  //   Insert all routes in bulk
  const createdRoutes = await Route.insertMany(routesToCreate);
  console.log(`✅ Created ${createdRoutes.length} routes`);

  // Handle unassigned delivery points
  const unassignedDeliveryPointIds = orsResponse.unassigned.map(
    (unassignedJob) => jobIdMap[unassignedJob.id]
  );

  const unassignedDeliveryPoints = createdDeliveryPoints.filter((dp) =>
    unassignedDeliveryPointIds.includes(dp._id.toString())
  );

  // Update assigned delivery points with their route IDs
  //   const updatePromises = createdRoutes.map((route) => {
  //     return DeliveryPoint.updateMany(
  //       { _id: { $in: route.deliveryPoints } },
  //       { $set: { routeId: route._id } }
  //     );
  //   });
  //   await Promise.all(updatePromises);
  //   console.log(`✅ Updated delivery points with route references`);

  // Log unassigned deliveries
  if (unassignedDeliveryPoints.length > 0) {
    console.warn(
      ` ${unassignedDeliveryPoints.length} delivery points could not be assigned to any route`
    );
  }

  //  Populate routes for complete response
  const populatedRoutes = await Route.find({
    _id: { $in: createdRoutes.map((r) => r._id) },
  })
    .populate("driverId", "name email phone vehicleId")
    // .populate("deliveryPoints")
    .lean();

  return {
    routes: populatedRoutes,
    unassignedDeliveries: unassignedDeliveryPoints.map((dp) => ({
      id: dp._id,
      address: dp.address,
      customerDetails: dp.customerDetails,
      weight: dp.weight,
      lat: dp.lat,
      lng: dp.lng,
    })),
    summary: {
      totalDeliveries: createdDeliveryPoints.length,
      assignedDeliveries:
        createdDeliveryPoints.length - unassignedDeliveryPoints.length,
      unassignedDeliveries: unassignedDeliveryPoints.length,
      totalRoutes: createdRoutes.length,
    },
  };
};
