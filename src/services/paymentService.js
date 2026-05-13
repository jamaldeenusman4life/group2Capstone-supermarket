import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import axios from 'axios';

const initiatePayment = async (orderId, customerId, method) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.customer.toString() !== customerId) {
    throw new Error("This order does not belong to you");
  }

  if (order.status !== "pending") {
    throw new Error("This order has already been paid for");
  }

  const payment = await Payment.create({
    order: orderId,
    customer: customerId,
    amount: order.totalAmount,
    method,
    status: "pending",
  });

  if (method === "card") {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: order.customerEmail,
        amount: order.totalAmount * 100,
        reference: payment._id.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    return {
      payment,
      paystackUrl: response.data.data.authorization_url
    };
  }

  return { payment };
};

const verifyPayment = async (reference) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      }
    }
  );

  const { status } = response.data.data;

  const payment = await Payment.findByIdAndUpdate(
    reference,
    {
      status: status === "success" ? "success" : "failed",
      transactionId: response.data.data.id,
    },
    { new: true },
  );

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (status === "success") {
    await Order.findByIdAndUpdate(payment.order, { status: "confirmed" });
  }

  return payment;
};

const getPaymentByOrder = async (orderId) => {
  const payment = await Payment.findOne({ order: orderId })
    .populate("order")
    .populate("customer", "name email");
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};

const getAllPayments = async () => {
  const payments = await Payment.find()
    .populate("order")
    .populate("customer", "name email");
  return payments;
};

export { initiatePayment, verifyPayment, getPaymentByOrder, getAllPayments };
