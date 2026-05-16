import Order from "../models/orderModel.js";
import {
  calculateOrderTotal,
  calculateDiscountedTotal,
} from "../utils/calculateTotal.js";

const createOrder = async (customerId, orderData) => {
  const calculatedTotal = calculateOrderTotal(orderData.items);
  const order = await Order.create({
    customer: customerId,
    ...orderData,
  });
  return order;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("customer", "name email")
    .populate("items.product", "name price");
  return orders;
};

const getOrder = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("customer", "name email")
    .populate("items.product", "name price");
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const getMyOrders = async (customerId) => {
  const orders = await Order.find({ customer: customerId }).populate(
    "items.product",
    "name price",
  );
  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const cancelOrder = async (orderId, customerId) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: customerId,
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== "pending") {
    throw new Error("Only pending orders can be cancelled");
  }
  order.status = "cancelled";
  await order.save();
  return order;
};

export {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
};
