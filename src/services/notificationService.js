import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

class NotificationService {
  /**
   * Create a new notification
   * @param {String} userId - User ID
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type (order, delivery, restock, promotion)
   * @param {String} relatedId - Optional related document ID
   * @returns {Object} Created notification
   */
  async createNotification(userId, title, message, type, relatedId = null) {
    // Validate required fields
    if (!userId || !title || !message || !type) {
      throw new Error("User ID, title, message, and type are required");
    }

    // Validate notification type
    const validTypes = ["order", "delivery", "restock", "promotion"];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Notification type must be one of: ${validTypes.join(", ")}`
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId: relatedId || null,
    });

    return notification;
  }

  /**
   * Get notifications for a user
   * @param {String} userId - User ID
   * @param {Boolean} isRead - Optional filter for read status
   * @param {Number} limit - Number of notifications to return
   * @param {Number} skip - Number of notifications to skip (for pagination)
   * @returns {Array} Array of notifications
   */
  async getNotifications(userId, isRead = null, limit = 20, skip = 0) {
    const query = { user: userId };

    if (isRead !== null) {
      query.isRead = isRead;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return notifications;
  }

  /**
   * Get unread notifications for a user
   * @param {String} userId - User ID
   * @returns {Array} Array of unread notifications
   */
  async getUnreadNotifications(userId) {
    const notifications = await Notification.find({
      user: userId,
      isRead: false,
    }).sort({ createdAt: -1 });

    return notifications;
  }

  /**
   * Get unread notification count for a user
   * @param {String} userId - User ID
   * @returns {Number} Count of unread notifications
   */
  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return count;
  }

  /**
   * Mark a notification as read
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (for verification)
   * @returns {Object} Updated notification
   */
  async markNotificationAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Verify notification belongs to the user
    if (notification.user.toString() !== userId) {
      throw new Error("Unauthorized access to this notification");
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    return updatedNotification;
  }

  /**
   * Mark all notifications as read for a user
   * @param {String} userId - User ID
   * @returns {Object} Update result
   */
  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return result;
  }

  /**
   * Delete a notification
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (for verification)
   * @returns {Object} Deleted notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Verify notification belongs to the user
    if (notification.user.toString() !== userId) {
      throw new Error("Unauthorized access to this notification");
    }

    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    return deletedNotification;
  }

  /**
   * Delete all notifications for a user
   * @param {String} userId - User ID
   * @returns {Object} Delete result
   */
  async deleteAllNotifications(userId) {
    const result = await Notification.deleteMany({ user: userId });
    return result;
  }

  /**
   * Create notifications for multiple users
   * @param {Array} userIds - Array of user IDs
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @returns {Array} Created notifications
   */
  async createBulkNotifications(userIds, title, message, type) {
    const notifications = userIds.map((userId) => ({
      user: userId,
      title,
      message,
      type,
    }));

    const createdNotifications = await Notification.insertMany(notifications);
    return createdNotifications;
  }
}

export default new NotificationService();
