import express from "express";
import {
  initiatePayment,
  verifyPayment,
  getPaymentByOrder,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import { validateInitiatePayment } from "../validations/paymentValidation.js";
const router = express.Router();

// Initiate payment
router.post(
  "/initiate",
  protect,
  restrictTo("customer"),
  validateBody(validateInitiatePayment),
  initiatePayment,
);

// Verify payment
router.get("/verify/:reference", protect, verifyPayment);

// Get payment by order
router.get(
  "/order/:orderId",
  protect,
  restrictTo("customer", "admin"),
  validateObjectId("orderId"),
  getPaymentByOrder,
);

// Get all payments
router.get("/", protect, restrictTo("admin"), getAllPayments);

export default router;
