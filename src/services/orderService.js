import Order from "../models/orderModel.js";

export const createOrder = async (customer, items) => {
  // calculate total amount
  const totalAmount = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // create order in DB
  const order = await Order.create({
    customer,
    items,
    totalAmount,
    status: "pending",
  });

  return order;
};

export const getAllOrdersService = async () => {
  return await Order.find();
};
