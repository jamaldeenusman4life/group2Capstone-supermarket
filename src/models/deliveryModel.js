import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },

    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["assigned", "pickedup", "ontheway", "delivered"],
      default: "assigned",
    },

    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },

    estimatedTime: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
