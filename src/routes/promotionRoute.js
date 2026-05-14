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

const router = express.Router();

// Admin-only routes
router.post("/", protect, restrictTo("admin"), createPromotion);
router.get("/", protect, restrictTo("admin"), getAllPromotions);
router.get("/active", getActivePromotions);
router.get("/:id", protect, restrictTo("admin"), getPromotionById);
router.put("/:id", protect, restrictTo("admin"), updatePromotion);
router.delete("/:id", protect, restrictTo("admin"), deletePromotion);

// Customer route to apply promotion
router.post("/apply", protect, applyPromotion);

export default router;
