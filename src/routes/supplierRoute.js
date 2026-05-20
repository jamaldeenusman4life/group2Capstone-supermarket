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
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import {
  validateCreateSupplier,
  validateUpdateSupplier,
  validateCreatePurchaseOrder,
  validateUpdatePurchaseOrderStatus,
} from "../validations/supplierValidation.js";

const router = express.Router();

// Get all suppliers - admin only
router.get(
  "/",
  protect,
  restrictTo("admin"),
  getAllSuppliers,
);

// Create supplier - admin only
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateBody(validateCreateSupplier),
  createSupplier,
);

// Get all purchase orders - admin only
router.get(
  "/purchase-orders/all",
  protect,
  restrictTo("admin"),
  getAllPurchaseOrders,
);

// Create purchase order - admin only
router.post(
  "/purchase-orders",
  protect,
  restrictTo("admin"),
  validateBody(validateCreatePurchaseOrder),
  createPurchaseOrder,
);

// Update purchase order status - admin only
router.put(
  "/purchase-orders/:id/status",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(validateUpdatePurchaseOrderStatus),
  updatePurchaseOrderStatus,
);

// Get single supplier - admin only
router.get(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  getSupplier,
);

// Update supplier - admin only
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(validateUpdateSupplier),
  updateSupplier,
);

// Delete supplier - admin only
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  deleteSupplier,
);

export default router;