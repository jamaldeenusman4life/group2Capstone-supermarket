import express from "express";
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  applyPromotion,
  getActivePromotions,
} from "../controllers/promotionController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import {
  validateCreatePromotion,
  validateUpdatePromotion,
  validateApplyPromotion,
} from "../validations/promotionValidation.js";

const router = express.Router();

// Create promotion
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateBody(validateCreatePromotion),
  createPromotion,
);

// Get all promotions
router.get("/", getAllPromotions);

// Get active promotions
router.get("/active", getActivePromotions);

// Apply promotion
router.post(
  "/apply",
  protect,
  restrictTo("customer"),
  validateBody(validateApplyPromotion),
  applyPromotion,
);

// Get single promotion
router.get("/:id", protect, validateObjectId(), getPromotionById);

// Update promotion
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(validateUpdatePromotion),
  updatePromotion,
);

// Delete promotion
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  deletePromotion,
);

export default router;
