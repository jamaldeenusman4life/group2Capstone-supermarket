import { initializePayment } from "../services/paymentService.js";
import { verifyPayment } from "../services/paymentService.js";
import Order from "../models/orderModel.js";

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
      // update order to paid
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: "paid" },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Payment verified, order updated",
        data: order
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};