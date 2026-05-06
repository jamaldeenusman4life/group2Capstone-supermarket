import express from "express";
import { createOrderController } from "../controllers/orderController.js";
import { updateOrderStatusController } from "../controllers/orderController.js";
import { getAllOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrderController);
router.patch("/:orderId/status", updateOrderStatusController);
router.get("/", getAllOrders);

export default router;
