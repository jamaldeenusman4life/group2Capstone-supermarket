import joi from "joi";
export const validateUser = joi
  .object({
    name: joi.string().trim().min(2).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be atleast 2 characters long",
    }),
    email: joi.string().email().lowercase().required().messages({
      "string.email": "Please provide a valid Email",
      "string.empty": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password must be atleast 6 characters long",
      "string.empty": "Password is required",
    }),
    role: joi
      .string()
      .valid("admin", "cashier", "customer", "rider")
      .required()
      .messages({
        "any.only": "Role must either be admin, cashier, customer, or rider",
      }),
    isActive: joi.boolean().default(true),
  })
  .unknown(false);

export const validateLogin = joi
  .object({
    email: joi.string().email().lowercase().required().messages({
      "string.email": "Please provide a valid Email",
      "string.empty": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password must be atleast 6 characters long",
      "string.empty": "Password is required",
    }),
  })
  .unknown(false);
