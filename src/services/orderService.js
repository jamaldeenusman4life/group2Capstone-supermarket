import Order from "../models/orderModel.js";
import {
  calculateOrderTotal,
  calculateDiscountedTotal,
} from "../utils/calculateTotal.js";
import sendEmail from "../utils/sendEmail.js";

const createOrder = async (customerId, orderData) => {
  const calculatedTotal = calculateOrderTotal(orderData.items);
  const order = await Order.create({
    customer: customerId,
    ...orderData,
  });

  try {
    const customer = await User.findById(customerId).select("name email");
    await sendEmail({
      to: customer.email,
      subject: "Order Confirmation 🛒",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2ECC71; text-align: center;">Order Confirmed! 🛒</h2>
        <p>Hi <strong>${customer.name}</strong>,</p>
        <p>Your order has been placed successfully.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333;">Order Details:</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> ₦${order.totalAmount}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toDateString()}</p>
        </div>
        <p>We will notify you when your order status changes.</p>
        <p style="color: #888; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
      </div>
    `,
    });
  } catch (emailError) {
    console.error("Order confirmation email failed:", emailError.message);
  }

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

  try {
    const updatedOrder = await Order.findById(orderId).populate(
      "customer",
      "name email",
    );
    await sendEmail({
      to: updatedOrder.customer.email,
      subject: `Order Status Update — ${status.toUpperCase()} 📦`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2ECC71; text-align: center;">Order Status Update 📦</h2>
        <p>Hi <strong>${updatedOrder.customer.name}</strong>,</p>
        <p>Your order status has been updated.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333;">Update Details:</h3>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p><strong>New Status:</strong> <span style="color: #2ECC71; font-weight: bold;">${status.toUpperCase()}</span></p>
          <p><strong>Total Amount:</strong> ₦${updatedOrder.totalAmount}</p>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
      </div>
    `,
    });
  } catch (emailError) {
    console.error("Order status email failed:", emailError.message);
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
