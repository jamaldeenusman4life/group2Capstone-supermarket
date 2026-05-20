import joi from "joi";
export const validateCategory = joi
  .object({
    name: joi.string().trim().min(3).required(),
    description: joi.string().max(50).optional(),
  })
  .unknown(false);

export const validateCategoryUpdate = joi
  .object({
    name: joi.string().trim().min(3).optional(),
    description: joi.string().max(50).optional(),
  })
  .min(1)
  .unknown(false);
