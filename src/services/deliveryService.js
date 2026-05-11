import Delivery from "../models/deliveryModel.js";

const createDelivery = async (deliveryData) => {
  const delivery = await Delivery.create(deliveryData);
  return delivery;
};

// Assign rider to delivery
const assignRider = async (deliveryId, riderId) => {
  const delivery = await Delivery.findByIdAndUpdate(
    deliveryId,
    { rider: riderId, status: "assigned" },
    { new: true },
  )
    .populate("rider", "name email")
    .populate("order");

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return delivery;
};

const updateDeliveryStatus = async (deliveryId, status) => {
  const updateData = { status };

  if (status === "delivered") {
    updateData.deliveredAt = new Date();
  }

  const delivery = await Delivery.findByIdAndUpdate(deliveryId, updateData, {
    new: true,
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return delivery;
};

const getDeliveryByOrder = async (orderId) => {
  const delivery = await Delivery.findOne({ order: orderId })
    .populate("rider", "name email")
    .populate("order");

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return delivery;
};

// Get all deliveries assigned to a rider
const getRiderDeliveries = async (riderId) => {
  const deliveries = await Delivery.find({ rider: riderId }).populate("order");
  return deliveries;
};

const getAllDeliveries = async () => {
  const deliveries = await Delivery.find()
    .populate("rider", "name email")
    .populate("order");
  return deliveries;
};

export {
  createDelivery,
  assignRider,
  updateDeliveryStatus,
  getDeliveryByOrder,
  getRiderDeliveries,
  getAllDeliveries,
};
