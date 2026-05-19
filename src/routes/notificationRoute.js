import express from "express";
import {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateBody, validateObjectId } from "../middlewares/validator.js";
import { validateCreateNotification } from "../validations/notificationValidation.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create notification
router.post("/", validateBody(validateCreateNotification), createNotification);

// Get notifications
router.get("/", getNotifications);
router.get("/unread", getUnreadNotifications);
router.get("/unread/count", getUnreadCount);

// Mark as read
router.put("/:id/read", validateObjectId(), markNotificationAsRead);
router.put("/read-all", markAllAsRead);

// Delete notification
router.delete("/:id", validateObjectId(), deleteNotification);

export default router;
