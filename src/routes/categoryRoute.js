import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import {
  validateCategory,
  validateCategoryUpdate,
} from "../validations/categoryValidation.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", validateObjectId(), getCategory);

// Admin only routes
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateBody(validateCategory),
  createCategory,
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(validateCategoryUpdate),
  updateCategory,
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  deleteCategory,
);

export default router;
