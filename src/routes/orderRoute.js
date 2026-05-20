import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "../validations/orderValidation.js";

const router = express.Router();

// Create order
router.post(
  "/",
  protect,
  restrictTo("customer"),
  validateBody(validateCreateOrder),
  createOrder,
);

// Update order status
router.put(
  "/:id/status",
  protect,
  restrictTo("admin", "cashier"),
  validateObjectId("id"),
  validateBody(validateUpdateOrderStatus),
  updateOrderStatus,
);

// Cancel order
router.put(
  "/:id/cancel",
  protect,
  restrictTo("customer"),
  validateObjectId("id"),
  cancelOrder,
);

// Get my orders
router.get("/my-orders", protect, restrictTo("customer"), getMyOrders);

// Get all orders
router.get("/", protect, restrictTo("admin", "cashier"), getAllOrders);

// Get single order
router.get(
  "/:id",
  protect,
  restrictTo("admin", "cashier"),
  validateObjectId("id"),
  getOrder,
);

export default router;
