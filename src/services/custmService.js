import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import generateCustomerID from "../utils/generateCustomerID.js";

export const createCustomerService = async ({ name, email, phone, password, address }) => {
  // Validate required fields
  if (!name || !email || !password || !phone || !address) {
    throw new Error("All fields are required");
  }

  // Check existing email
  const oldEmail = await User.findOne({ email });

  if (oldEmail) {
    throw new Error("Customer with email already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: "customer",
  });

  // Create customer
  const customer = await Customer.create({
    user: user._id,
    customerID: generateCustomerID(),
    address,
  });

  // Populate user
  const createdCustomer = await Customer.findById(customer._id).populate("user");

  return createdCustomer;
};