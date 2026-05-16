import joi from "joi";
export const validateCreateSupplier = joi
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

export const validateUpdateSupplier = joi
  .object({
    name: joi.string().trim().min(3).optional().messages({
      "string.min": "Supplier name must be at least 3 characters long",
    }),
    email: joi.string().email().trim().lowercase().optional().messages({
      "string.email": "Please provide a valid business email",
    }),
    phone: joi
      .string()
      .pattern(/^[0-9+]{10,15}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Phone number must be between 10-15 digits and can include the + sign",
      }),
    address: joi.string().trim().max(50).optional(),
  })
  .unknown(false)
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });

export const validateCreatePurchaseOrder = joi
  .object({
    supplier: joi.string().hex().length(24).required().messages({ 
      "string.empty": "Supplier ID is required",
      "string.hex": "Supplier ID must be a valid hexadecimal string",
      "string.length": "Supplier ID must be 24 characters long",
    }),
    products: joi.array().items(joi.string().hex().length(24)).min(1).required().messages({
      "array.base": "Products must be an array",
      "array.min": "At least one product must be included",
      "string.hex": "Each product ID must be a valid hexadecimal string",
      "string.length": "Each product ID must be 24 characters long",
    }),
    totalAmount: joi.number().positive().required().messages({
      "number.base": "Total amount must be a number",
      "number.positive": "Total amount must be a positive number",
      "any.required": "Total amount is required",
    }),
  })
  .unknown(false);

export const validateUpdatePurchaseOrderStatus = joi
  .object({
    status: joi
      .string()
      .valid("pending", "received", "cancelled")
      .required()
      .messages({
        "any.only": "Status must be one of: pending, received, cancelled",
        "string.empty": "Status is required",
      }),
  })
  .unknown(false);
