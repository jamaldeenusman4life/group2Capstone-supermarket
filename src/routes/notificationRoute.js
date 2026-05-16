import express from "express";
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get notifications
router.get("/", getNotifications);
router.get("/unread", getUnreadNotifications);
router.get("/unread/count", getUnreadCount);

// Mark as read
router.put("/:id/read", markNotificationAsRead);
router.put("/read-all", markAllAsRead);

// Delete notifications
router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

export default router;
