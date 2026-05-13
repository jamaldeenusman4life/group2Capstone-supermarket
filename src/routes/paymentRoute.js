import express from "express";
import {
  initiatePayment,
  verifyPayment,
  getPaymentByOrder,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/initiate", protect, restrictTo("customer"), initiatePayment);
router.get("/verify/:reference", protect, verifyPayment);
router.get(
  "/order/:orderId",
  protect,
  restrictTo("customer", "admin"),
  getPaymentByOrder,
);

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllPayments);

export default router;
