import express from "express";
import { initializePaymentController } from "../controllers/paymentController.js";
import { verifyPaymentController } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initialize", initializePaymentController);
router.post("/verify", verifyPaymentController);

export default router;
