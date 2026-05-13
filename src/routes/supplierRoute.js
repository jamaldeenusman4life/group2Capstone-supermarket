import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
} from "../controllers/supplierController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All supplier routes are admin only
router.get("/", protect, restrictTo("admin"), getAllSuppliers);
router.post("/", protect, restrictTo("admin"), createSupplier);
router.get("/:id", protect, restrictTo("admin"), getSupplier);
router.put("/:id", protect, restrictTo("admin"), updateSupplier);
router.delete("/:id", protect, restrictTo("admin"), deleteSupplier);

// Purchase order routes
router.get(
  "/purchase-orders/all",
  protect,
  restrictTo("admin"),
  getAllPurchaseOrders,
);
router.post(
  "/purchase-orders",
  protect,
  restrictTo("admin"),
  createPurchaseOrder,
);
router.put(
  "/purchase-orders/:id/status",
  protect,
  restrictTo("admin"),
  updatePurchaseOrderStatus,
);

export default router;
