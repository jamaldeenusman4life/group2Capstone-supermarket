import express from "express";
import {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  validateProduct,
  updateProductValidation,
} from "../validations/productValidation.js";
import { validate } from "../middlewares/validate.js";
import { verifyEntityExists } from "../middlewares/verifyEnitity.js";
import { validateObjectId } from "../middlewares/validateId.js";
import Category from "../models/categoryModels.js";
import Supplier from "../models/supplierModel.js";
import { restrictTo } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post(
  "/product",
  restrictTo("admin"),
  validate(validateProduct),
  verifyEntityExists(Category, category),
  verifyEntityExists(Supplier, supplier),
  createProduct,
);
router.get("/product/:id", validateObjectId, getProduct);
router.get("/product", getAllProduct);
router.update(
  "/product/:id",
  restrictTo("admin"),
  validateObjectId,
  validate(updateProductValidation),
  verifyEntityExists(Category, category),
  verifyEntityExists(Supplier, supplier),
  updateProduct,
);
router.delete(
  "/product/:id",
  restrictTo("admin"),
  validateObjectId,
  deleteProduct,
);
