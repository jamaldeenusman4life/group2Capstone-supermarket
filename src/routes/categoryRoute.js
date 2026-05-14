import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validate } from "../middlewares/validate.js";
import { validateCategory } from "../validations/categoryValidation.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/category", getAllCategories);
router.get("/category/:id", getCategory);

// Admin only routes
router.post(
  "/category",
  protect,
  validate(validateCategory),
  restrictTo("admin"),
  createCategory,
);
router.put("/category/:id", protect, restrictTo("admin"), updateCategory);
router.delete("/category/:id", protect, restrictTo("admin"), deleteCategory);

export default router;
