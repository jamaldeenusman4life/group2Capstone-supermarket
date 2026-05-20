import joi from "joi";
export const validateProduct = joi
  .object({
    name: joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Product name cannot be empty",
      "string.min": "Product name should be at least 3 characters long",
    }),
    description: joi.string().trim().max(50).optional(),
    price: joi.number().positive().required(),
    quantity: joi.number().integer().min(0).required(),
    category: joi.string().hex().length(24).required(),
    supplier: joi.string().hex().length(24).optional(),
    lowStockThreshold: joi.number().integer().min(0).default(10),
    expiryDate: joi.date().greater("now").optional(),
    images: joi.array().items(joi.string().uri()).max(5),
    isAvailable: joi.boolean().default(true),
  })
  .unknown(false);
export const updateProductValidation = joi
  .object({
    name: joi.string().trim().min(3).max(50).optional(),
    description: joi.string().trim().max(50).optional(),
    price: joi.number().positive().optional(),
    quantity: joi.number().integer().min(0).optional(),
    category: joi.string().hex().length(24).optional(),
    supplier: joi.string().hex().length(24).optional(),
    lowStockThreshold: joi.number().integer().min(0).optional(),
    expiryDate: joi.date().greater("now").optional(),
    images: joi.array().items(joi.string().uri()).max(5).optional(),
  })
  .min(1)
  .unknown(false);
