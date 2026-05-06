import Order from "../models/orderModel.js";

export const createOrder = async (userId, items) => {
  // calculate total amount
  const totalAmount = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // create order in DB
  const order = await Order.create({
    userId,
    items,
    totalAmount,
    orderStatus: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  });

  return order;
};

export const getAllOrdersService = async () => {
  return await Order.find();
};
