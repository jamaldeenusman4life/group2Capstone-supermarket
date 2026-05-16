import Joi from "joi";

export const validateUpdateCustomer = Joi.object({
  name: Joi.string().trim().min(2).optional().messages({
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().lowercase().optional().messages({
    "string.email": "Please provide a valid email",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid 11 digit phone number",
    }),
}).unknown(false);
