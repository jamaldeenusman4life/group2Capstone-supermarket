import promotionService from "../services/promotionService.js";

/**
 * Create a new promotion
 */
export const createPromotion = async (req, res) => {
  try {
    const promotion = await promotionService.createPromotion(req.body);
    res.status(201).json({
      status: "success",
      message: "Promotion created successfully",
      data: { promotion },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get all promotions
 */
export const getAllPromotions = async (req, res) => {
  try {
    const filters = {
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      code: req.query.code,
    };

    const promotions = await promotionService.getAllPromotions(filters);
    res.status(200).json({
      status: "success",
      data: { promotions },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get a single promotion by ID
 */
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await promotionService.getPromotionById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { promotion },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Update a promotion
 */
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await promotionService.updatePromotion(
      req.params.id,
      req.body
    );
    res.status(200).json({
      status: "success",
      message: "Promotion updated successfully",
      data: { promotion },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Delete a promotion
 */
export const deletePromotion = async (req, res) => {
  try {
    await promotionService.deletePromotion(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Apply a promotion to an order
 */
export const applyPromotion = async (req, res) => {
  try {
    const { code, orderId } = req.body;

    if (!code || !orderId) {
      return res.status(400).json({
        status: "error",
        message: "Promotion code and order ID are required",
      });
    }

    const order = await promotionService.applyPromotion(code, orderId);
    res.status(200).json({
      status: "success",
      message: "Promotion applied successfully",
      data: { order },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get active promotions
 */
export const getActivePromotions = async (req, res) => {
  try {
    const promotions = await promotionService.getActivePromotions();
    res.status(200).json({
      status: "success",
      data: { promotions },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
