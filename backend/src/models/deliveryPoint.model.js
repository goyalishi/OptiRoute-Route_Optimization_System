import mongoose from "mongoose";

const deliveryPointSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    customerDetails: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    weight: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "delivered"],
      default: "pending",
    },
    // routeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Route",
    // },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryPoint", deliveryPointSchema);
