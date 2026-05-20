import express from "express";
import {
  createDelivery,
  assignRider,
  updateDeliveryStatus,
  getDeliveryByOrder,
  getRiderDeliveries,
  getAllDeliveries,
} from "../controllers/deliveryController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import {
  validateCreateDelivery,
  validateAssignRider,
  validateUpdateDeliveryStatus,
} from "../validations/deliveryValidation.js";

const router = express.Router();

// Create delivery
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateBody(validateCreateDelivery),
  createDelivery,
);

// Assign rider
router.put(
  "/:id/assign",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(validateAssignRider),
  assignRider,
);

// Update delivery status
router.put(
  "/:id/status",
  protect,
  restrictTo("rider", "admin"),
  validateObjectId(),
  validateBody(validateUpdateDeliveryStatus),
  updateDeliveryStatus,
);

// Get my deliveries
router.get("/my-deliveries", protect, restrictTo("rider"), getRiderDeliveries);

// Get delivery by order
router.get(
  "/order/:orderId",
  protect,
  restrictTo("customer", "admin"),
  validateObjectId("orderId"),
  getDeliveryByOrder,
);

// Get all deliveries
router.get("/", protect, restrictTo("admin"), getAllDeliveries);

export default router;
