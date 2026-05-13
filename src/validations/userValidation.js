import joi from "joi";
export const validateUser = joi
  .object({
    name: joi.string().trim().min(2).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be atleast 2 characters long",
    }),
    email: joi.string().email().lowercase().required().message({
      "string.email ": "Please provide a valid Email",
      "string.empty": "Email is required",
    }),
    password: joi.string().min(8).required().message({
      "string.min": "Password must be atleast 8 characters long",
      "string.empty": "Password is required",
    }),
    role: joi
      .string()
      .valid("admin", "cashier", "customer", "rider")
      .required()
      .messages({
        " any.role": "Role must either be admin, cashier, customer, or rider",
      }),
    isActive: joi.string().boolean().default(true),
  })
  .unknown(false);
