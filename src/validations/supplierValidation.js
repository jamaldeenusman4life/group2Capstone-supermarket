import joi from "joi";
export const validateSupplier = joi
  .object({
    name: joi.string().trim().min(3).required().messages({
      "string.empty": "Supplier name cannot be empty",
      "string.min": "Supplier name must be at least 3 characters long",
    }),
    email: joi.string().email().trim().lowercase().required().messages({
      "string.email": "Please provide a valid business email",
      "string.empty": "Please provide a valid business email",
    }),
    phone: joi
      .string()
      .pattern(/^[0-9+]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be between 10-15 digits and can include the + sign",
      }),
    address: joi.string().trim().max(50).optional(),
  })
  .unknown(false);
