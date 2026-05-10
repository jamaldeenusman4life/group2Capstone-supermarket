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

const router = express.Router();

// All routes require admin authentication
router.use(protect, restrictTo("admin"));

// Report generation endpoints
router.get("/sales", generateSalesReport);
router.get("/products", generateProductReport);
router.get("/promotions", generatePromotionReport);
router.get("/customers", generateCustomerReport);
router.get("/payments", generatePaymentReport);

// Saved reports management endpoints
router.get("/saved/statistics", getReportStatistics);
router.get("/saved", getSavedReports);
router.get("/saved/:id", getSavedReportById);
router.put("/saved/:id/archive", archiveReport);
router.delete("/saved/:id", deleteReport);

export default router;