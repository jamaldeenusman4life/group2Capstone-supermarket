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
    supplier: joi
      .string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid supplier ID",
        "string.empty": "Supplier ID is required",
      }),
    products: joi
      .array()
      .items(
        joi.object({
          product: joi
            .string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
              "string.pattern.base": "Invalid product ID",
              "string.empty": "Product ID is required",
            }),
          quantity: joi.number().min(1).required().messages({
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required",
          }),
        }),
      )
      .min(1)
      .required()
      .messages({
        "array.min": "Purchase order must have at least one product",
        "any.required": "Products are required",
      }),
    totalAmount: joi.number().min(0).optional().messages({
      "number.min": "Total amount cannot be negative",
    }),
    status: joi
      .string()
      .valid("pending", "received", "cancelled")
      .optional()
      .messages({
        "any.only": "Status must be one of: pending, received, cancelled",
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
