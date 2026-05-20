import Joi from "joi";

export const validateInitiatePayment = Joi.object({
  orderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid order ID",
      "string.empty": "Order ID is required",
    }),
  method: Joi.string().valid("card", "transfer", "cash").required().messages({
    "any.only": "Payment method must be one of: card, transfer, cash",
    "string.empty": "Payment method is required",
  }),
}).unknown(false);
