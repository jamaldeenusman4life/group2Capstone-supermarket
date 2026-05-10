import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Customer routes
router.post("/", protect, restrictTo("customer"), createOrder);
router.get("/user-orders", protect, restrictTo("customer"), getUserOrders);
router.put("/:id/status", protect, restrictTo("customer"), cancelOrder);

//Admin and cashier routes
router.get("/", protect, restrictTo("admin", "cashier"), getAllOrders);
router.get("/:id", protect, restrictTo("admin", "cashier"), getOrder);
router.put(
  "/:id/status",
  protect,
  restrictTo("admin", "cashier"),
  updateOrderStatus,
);

export default router;
