import express from "express";
import {
  generateSalesReport,
  generateProductReport,
  generatePromotionReport,
  generateCustomerReport,
  generatePaymentReport,
  getSavedReports,
  getSavedReportById,
  archiveReport,
  deleteReport,
  getReportStatistics,
} from "../controllers/reportController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validator.js";

const router = express.Router();

// All report routes are admin only

// Generate reports
router.get("/sales", protect, restrictTo("admin"), generateSalesReport);

router.get("/products", protect, restrictTo("admin"), generateProductReport);

router.get("/revenue", protect, restrictTo("admin"), generatePaymentReport);

router.get("/customers", protect, restrictTo("admin"), generateCustomerReport);

router.get(
  "/promotions",
  protect,
  restrictTo("admin"),
  generatePromotionReport,
);

export default router;
