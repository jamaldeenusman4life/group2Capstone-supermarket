import express from "express";
import {
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customerController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin only
router.get("/", protect, restrictTo("admin"), getAllCustomers);

// Customer and admin
router.get("/:id", protect, restrictTo("customer", "admin"), getCustomer);

// Customer only
router.put("/:id", protect, restrictTo("customer"), updateCustomer);

export default router;
