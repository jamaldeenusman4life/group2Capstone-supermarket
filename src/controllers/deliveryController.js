import * as deliveryService from "../services/deliveryService.js";

const createDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);
    res.status(201).json({
      status: "success",
      data: { delivery },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const assignRider = async (req, res) => {
  try {
    const delivery = await deliveryService.assignRider(
      req.params.id,
      req.body.riderId,
    );
    res.status(200).json({
      status: "success",
      data: { delivery },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(
      req.params.id,
      req.body.status,
    );
    res.status(200).json({
      status: "success",
      data: { delivery },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await deliveryService.getDeliveryByOrder(
      req.params.orderId,
    );
    res.status(200).json({
      status: "success",
      data: { delivery },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const getRiderDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryService.getRiderDeliveries(req.user.id);
    res.status(200).json({
      status: "success",
      results: deliveries.length,
      data: { deliveries },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await deliveryService.getAllDeliveries();
    res.status(200).json({
      status: "success",
      results: deliveries.length,
      data: { deliveries },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  createDelivery,
  assignRider,
  updateDeliveryStatus,
  getDeliveryByOrder,
  getRiderDeliveries,
  getAllDeliveries,
};
