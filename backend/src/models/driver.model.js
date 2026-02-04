import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: { type: String },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    routeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
    status: {
      type: String,
      enum: ["free", "busy", "offline"],
      default: "free",
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    verified: {
      type: Boolean,
      default: false, //  not verified by default
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
