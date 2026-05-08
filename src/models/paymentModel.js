import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    method: {
      type: String,
      default: "paystack",
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
