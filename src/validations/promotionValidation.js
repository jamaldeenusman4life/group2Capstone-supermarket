import Joi from "joi";

export const validateCreatePromotion = Joi.object({
  code: Joi.string().trim().min(3).uppercase().required().messages({
    "string.empty": "Promotion code is required",
    "string.min": "Promotion code must be at least 3 characters",
  }),
  discountType: Joi.string().valid("percentage", "fixed").required().messages({
    "any.only": "Discount type must be either percentage or fixed",
    "string.empty": "Discount type is required",
  }),
  discountValue: Joi.number().min(0).required().messages({
    "number.min": "Discount value cannot be negative",
    "any.required": "Discount value is required",
  }),
  minOrderAmount: Joi.number().min(0).default(0).messages({
    "number.min": "Minimum order amount cannot be negative",
  }),
  expiryDate: Joi.date().greater("now").required().messages({
    "date.greater": "Expiry date must be in the future",
    "any.required": "Expiry date is required",
  }),
  usageLimit: Joi.number().min(1).optional().messages({
    "number.min": "Usage limit must be at least 1",
  }),
  isActive: Joi.boolean().default(true),
}).unknown(false);

export const validateUpdatePromotion = Joi.object({
  code: Joi.string().trim().min(3).uppercase().optional().messages({
    "string.min": "Promotion code must be at least 3 characters",
  }),
  discountType: Joi.string().valid("percentage", "fixed").optional().messages({
    "any.only": "Discount type must be either percentage or fixed",
  }),
  discountValue: Joi.number().min(0).optional().messages({
    "number.min": "Discount value cannot be negative",
  }),
  minOrderAmount: Joi.number().min(0).optional().messages({
    "number.min": "Minimum order amount cannot be negative",
  }),
  expiryDate: Joi.date().greater("now").optional().messages({
    "date.greater": "Expiry date must be in the future",
  }),
  usageLimit: Joi.number().min(1).optional().messages({
    "number.min": "Usage limit must be at least 1",
  }),
  isActive: Joi.boolean().optional(),
}).unknown(false);

export const validateApplyPromotion = Joi.object({
  code: Joi.string().trim().required().messages({
    "string.empty": "Promotion code is required",
  }),
  orderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid order ID",
      "string.empty": "Order ID is required",
    }),
}).unknown(false);
