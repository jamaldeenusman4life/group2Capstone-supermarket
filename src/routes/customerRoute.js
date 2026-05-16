import express from "express";
import {
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customerController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import { validateUpdateCustomer } from "../validations/customerValidation.js";

const router = express.Router();

// Admin only
router.get("/", protect, restrictTo("admin"), getAllCustomers);

// Customer and admin
router.get(
  "/:id",
  protect,
  restrictTo("customer", "admin"),
  validateObjectId(),
  getCustomer,
);

// Customer only
router.put(
  "/:id",
  protect,
  restrictTo("customer"),
  validateObjectId(),
  validateBody(validateUpdateCustomer),
  updateCustomer,
);

export default router;
