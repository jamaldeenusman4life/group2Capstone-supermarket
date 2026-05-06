import { initializePayment } from "../services/paymentService.js";
import { verifyPayment } from "../services/paymentService.js";
import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";

export const initializePaymentController = async (req, res) => {
  try {
    const { email, amount } = req.body;

    const payment = await initializePayment(email, amount);

    res.json({
      success: true,
      paymentLink: payment.authorization_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    const paymentData = await verifyPayment(reference);

    if (paymentData.status === "success") {
      // get order first (to get customer_id)
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // update order status
      order.status = "confirmed";
      await order.save();

      // create payment record
      await Payment.create({
        order_id: orderId,
        customer_id: order.customer,
        amount: paymentData.amount / 100,
        status: "success",
        method: "paystack",
        transactionId: paymentData.reference,
      });

      return res.json({
        success: true,
        message: "Payment verified, order updated",
        data: order,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
