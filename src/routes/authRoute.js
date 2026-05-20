import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validator.js";
import { validateUser, validateLogin } from "../validations/userValidation.js";

const router = express.Router();

// Public routes - no token needed
router.post("/register", validateBody(validateUser), registerUser);
router.post("/login", validateBody(validateLogin), loginUser);

// Protected routes - token required
router.get("/me", protect, getMe);

export default router;
