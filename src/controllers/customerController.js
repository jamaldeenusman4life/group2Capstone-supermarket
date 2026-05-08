import { createCustomerService } from "../services/custmService.js";

const createCustomer = async (req, res) => {
  try {
    const{ name, email, phone, password, address } = req.body;
    const createdACustomer = await createCustomerService(req.body);

    return res.status(201).json({
      message: "Customer created successfully",
      createdACustomer,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


export { createCustomer };