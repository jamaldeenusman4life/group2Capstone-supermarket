import Joi from "joi";

export const validateCreateOrder = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Invalid product ID",
            "string.empty": "Product ID is required",
          }),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
        price: Joi.number().min(0).required().messages({
          "number.min": "Price cannot be negative",
          "any.required": "Price is required",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Order must have at least one item",
      "any.required": "Items are required",
    }),
  totalAmount: Joi.number().min(0).required().messages({
    "number.min": "Total amount cannot be negative",
    "any.required": "Total amount is required",
  }),
  promotion: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid promotion ID",
    }),
  discountAmount: Joi.number().min(0).default(0),
}).unknown(false);

export const validateUpdateOrderStatus = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "dispatched", "delivered", "cancelled")
    .required()
    .messages({
      "any.only":
        "Status must be one of: pending, confirmed, dispatched, delivered, cancelled",
      "string.empty": "Status is required",
    }),
}).unknown(false);
