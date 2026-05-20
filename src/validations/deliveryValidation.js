import Joi from "joi";

export const validateCreateDelivery = Joi.object({
  order: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid order ID",
      "string.empty": "Order ID is required",
    }),
  deliveryAddress: Joi.string().trim().min(5).required().messages({
    "string.empty": "Delivery address is required",
    "string.min": "Please provide a valid delivery address",
  }),
  estimatedTime: Joi.date().optional(),
}).unknown(false);

export const validateAssignRider = Joi.object({
  riderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid rider ID",
      "string.empty": "Rider ID is required",
    }),
}).unknown(false);

export const validateUpdateDeliveryStatus = Joi.object({
  status: Joi.string()
    .valid("assigned", "pickedup", "ontheway", "delivered")
    .required()
    .messages({
      "any.only":
        "Status must be one of: assigned, pickedup, ontheway, delivered",
      "string.empty": "Status is required",
    }),
}).unknown(false);
