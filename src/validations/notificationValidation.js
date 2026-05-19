import Joi from "joi";

export const validateCreateNotification = Joi.object({
  title: Joi.string().trim().min(2).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
  }),

  message: Joi.string().trim().min(2).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 2 characters",
  }),

  type: Joi.string()
    .valid("order", "delivery", "restock", "promotion")
    .required()
    .messages({
      "any.only": "Type must be one of: order, delivery, restock, promotion",
      "string.empty": "Type is required",
    }),

  relatedId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid related ID",
    }),
}).unknown(false);
