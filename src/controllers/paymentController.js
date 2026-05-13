import * as paymentService from "../services/paymentService.js";

const initiatePayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;
    const result = await paymentService.initiatePayment(
      orderId,
      req.user.id,
      method,
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const payment = await paymentService.verifyPayment(req.params.reference);
    res.status(200).json({
      status: "success",
      data: { payment },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByOrder(req.params.orderId);
    res.status(200).json({
      status: "success",
      data: { payment },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({
      status: "success",
      results: payments.length,
      data: { payments },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { initiatePayment, verifyPayment, getPaymentByOrder, getAllPayments };
