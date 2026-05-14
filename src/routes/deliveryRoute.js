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

const router = express.Router();

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllDeliveries);
router.post("/", protect, restrictTo("admin"), createDelivery);
router.put("/:id/assign", protect, restrictTo("admin"), assignRider);

// Rider routes
router.get("/my-deliveries", protect, restrictTo("rider"), getRiderDeliveries);
router.put(
  "/:id/status",
  protect,
  restrictTo("rider", "admin"),
  updateDeliveryStatus,
);

// Customer and admin routes
router.get(
  "/order/:orderId",
  protect,
  restrictTo("customer", "admin"),
  getDeliveryByOrder,
);

export default router;
