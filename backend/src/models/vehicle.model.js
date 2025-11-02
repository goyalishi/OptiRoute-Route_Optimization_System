import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    }, // e.g., bike, van, tempo
    capacity: {
      type: Number,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    startLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ["free", "busy", "maintenance"],
      default: "free",
    },
    model: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
