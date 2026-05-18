import express from "express";
import {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock,
  getExpiringProducts,
} from "../controllers/productController.js";
import {
  validateProduct,
  updateProductValidation,
} from "../validations/productValidation.js";
import {
  validateBody,
  validateObjectId,
  verifyEntityExists,
} from "../middlewares/validator.js";
import Category from "../models/categoryModel.js";
import Supplier from "../models/supplierModel.js";
import { restrictTo, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateBody(validateProduct),
  verifyEntityExists(Category, "category"),
  verifyEntityExists(Supplier, "supplier"),
  createProduct,
);
router.get("/", getAllProduct);
router.get(
  "/inventory/low-stock",
  protect,
  restrictTo("admin"),
  getLowStockProducts,
);
router.get(
  "/inventory/expiring",
  protect,
  restrictTo("admin"),
  getExpiringProducts,
);
router.get("/:id", validateObjectId(), getProduct);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  validateBody(updateProductValidation),
  verifyEntityExists(Category, "category"),
  verifyEntityExists(Supplier, "supplier"),
  updateProduct,
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validateObjectId(),
  deleteProduct,
);
router.put("/inventory/:id/stock", protect, restrictTo("admin"), updateStock);
export default router;
