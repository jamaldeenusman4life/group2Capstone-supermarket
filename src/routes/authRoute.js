import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes - no token needed
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes - token required
router.get("/me", protect, getUser);

export default router;
