import Promotion from "../models/promotionModel.js";
import Order from "../models/orderModel.js";

class PromotionService {
  /**
   * Create a new promotion
   * @param {Object} promotionData - Promotion data
   * @returns {Object} Created promotion
   */
  async createPromotion(promotionData) {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate,
      usageLimit,
    } = promotionData;

    // Validate required fields
    if (!code || !discountType || !discountValue || !expiryDate) {
      throw new Error(
        "Code, discount type, discount value, and expiry date are required"
      );
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(discountType)) {
      throw new Error("Discount type must be either 'percentage' or 'fixed'");
    }

    // Validate discount value
    if (discountValue <= 0) {
      throw new Error("Discount value must be greater than 0");
    }

    // Validate percentage discount
    if (discountType === "percentage" && discountValue > 100) {
      throw new Error("Percentage discount cannot exceed 100");
    }

    // Check if code already exists
    const existingPromotion = await Promotion.findOne({ code: code.toUpperCase() });
    if (existingPromotion) {
      throw new Error("Promotion code already exists");
    }

    // Validate expiry date
    const expiryDateTime = new Date(expiryDate);
    if (expiryDateTime <= new Date()) {
      throw new Error("Expiry date must be in the future");
    }

    const promotion = await Promotion.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      expiryDate: expiryDateTime,
      usageLimit: usageLimit || null,
    });

    return promotion;
  }

  /**
   * Get all promotions with optional filters
   * @param {Object} filters - Query filters
   * @returns {Array} Array of promotions
   */
  async getAllPromotions(filters = {}) {
    const query = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.code) {
      query.code = { $regex: filters.code, $options: "i" };
    }

    const promotions = await Promotion.find(query).sort({ createdAt: -1 });
    return promotions;
  }

  /**
   * Get a single promotion by ID
   * @param {String} id - Promotion ID
   * @returns {Object} Promotion document
   */
  async getPromotionById(id) {
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    return promotion;
  }

  /**
   * Update a promotion
   * @param {String} id - Promotion ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated promotion
   */
  async updatePromotion(id, updateData) {
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }

    // Validate discount type if being updated
    if (
      updateData.discountType &&
      !["percentage", "fixed"].includes(updateData.discountType)
    ) {
      throw new Error("Discount type must be either 'percentage' or 'fixed'");
    }

    // Validate discount value if being updated
    if (updateData.discountValue !== undefined) {
      if (updateData.discountValue <= 0) {
        throw new Error("Discount value must be greater than 0");
      }

      const discountType = updateData.discountType || promotion.discountType;
      if (discountType === "percentage" && updateData.discountValue > 100) {
        throw new Error("Percentage discount cannot exceed 100");
      }
    }

    // Validate expiry date if being updated
    if (updateData.expiryDate) {
      const expiryDateTime = new Date(updateData.expiryDate);
      if (expiryDateTime <= new Date()) {
        throw new Error("Expiry date must be in the future");
      }
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedPromotion;
  }

  /**
   * Delete a promotion
   * @param {String} id - Promotion ID
   * @returns {Object} Deleted promotion
   */
  async deletePromotion(id) {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    return promotion;
  }

  /**
   * Apply a promotion to an order
   * @param {String} code - Promotion code
   * @param {String} orderId - Order ID
   * @returns {Object} Updated order with applied promotion
   */
  async applyPromotion(code, orderId) {
    // Find the promotion
    const promotion = await Promotion.findOne({ code: code.toUpperCase() });
    if (!promotion) {
      throw new Error("Invalid promotion code");
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      throw new Error("This promotion is no longer active");
    }

    // Check if promotion has expired
    if (new Date() > promotion.expiryDate) {
      throw new Error("This promotion has expired");
    }

    // Check if promotion has reached usage limit
    if (
      promotion.usageLimit &&
      promotion.usageCount >= promotion.usageLimit
    ) {
      throw new Error("This promotion has reached its usage limit");
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Check if order meets minimum amount requirement
    if (order.totalAmount < promotion.minOrderAmount) {
      throw new Error(
        `Order must be at least ${promotion.minOrderAmount} to use this promotion`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promotion.discountType === "percentage") {
      discountAmount = (order.totalAmount * promotion.discountValue) / 100;
    } else {
      discountAmount = promotion.discountValue;
    }

    // Ensure discount doesn't exceed order total
    if (discountAmount > order.totalAmount) {
      discountAmount = order.totalAmount;
    }

    // Update order with promotion
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        promotion: promotion._id,
        discountAmount,
      },
      { new: true }
    );

    // Increment promotion usage count
    await Promotion.findByIdAndUpdate(promotion._id, {
      usageCount: promotion.usageCount + 1,
    });

    return updatedOrder;
  }

  /**
   * Get active promotions
   * @returns {Array} Array of active promotions
   */
  async getActivePromotions() {
    const promotions = await Promotion.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    return promotions;
  }
}

export default new PromotionService();
