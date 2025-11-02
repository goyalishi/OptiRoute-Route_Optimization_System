import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    optimizedSeq: [
      {
        deliveryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DeliveryPoint",
          required: true,
        },
        locationName: String,
        lat: Number,
        lng: Number,
      },
    ],
    googleMapsLink: { type: String },
    travelMode: {
      type: String,
      default: "driving",
    },
    totalDistance: { type: Number },
    totalTime: { type: Number },
    deliveryPoints: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPoint" },
    ],
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Route", routeSchema);
