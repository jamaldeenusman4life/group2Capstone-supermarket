import User from "../models/userModel.js";

const getAllCustomers = async () => {
  const customers = await User.find({ role: "customer" }).select("-password");
  return customers;
};

const getCustomer = async (customerId) => {
  const customer = await User.findById(customerId).select("-password");

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

const updateCustomer = async (customerId, updateData) => {
  // Prevent role and password from being updated here
  delete updateData.role;
  delete updateData.password;

  const customer = await User.findByIdAndUpdate(customerId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export { getAllCustomers, getCustomer, updateCustomer };
