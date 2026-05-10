import notificationService from "../services/notificationService.js";

/**
 * Get all notifications for the authenticated user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const notifications = await notificationService.getNotifications(
      userId,
      null,
      limit,
      skip
    );

    res.status(200).json({
      status: "success",
      data: { notifications },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get unread notifications for the authenticated user
 */
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUnreadNotifications(
      userId
    );

    res.status(200).json({
      status: "success",
      data: { notifications },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get unread notification count for the authenticated user
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      status: "success",
      data: { unreadCount: count },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markNotificationAsRead(
      notificationId,
      userId
    );

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Mark all notifications as read for the authenticated user
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      status: "success",
      message: "All notifications marked as read",
      data: { result },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    await notificationService.deleteNotification(notificationId, userId);

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Delete all notifications for the authenticated user
 */
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.deleteAllNotifications(userId);

    res.status(200).json({
      status: "success",
      message: "All notifications deleted successfully",
      data: { result },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
