import express from "express";
import {
  createCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes - no token needed
router.post("/register", createCustomer);




export default router;
