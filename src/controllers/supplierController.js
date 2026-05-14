import * as supplierService from "../services/supplierService.js";

const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
      status: "success",
      data: { supplier },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.status(200).json({
      status: "success",
      results: suppliers.length,
      data: { suppliers },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplier(req.params.id);
    res.status(200).json({
      status: "success",
      data: { supplier },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      status: "success",
      data: { supplier },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await supplierService.createPurchaseOrder(req.body);
    res.status(201).json({
      status: "success",
      data: { purchaseOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await supplierService.getAllPurchaseOrders();
    res.status(200).json({
      status: "success",
      results: purchaseOrders.length,
      data: { purchaseOrders },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const purchaseOrder = await supplierService.updatePurchaseOrderStatus(
      req.params.id,
      req.body.status,
    );
    res.status(200).json({
      status: "success",
      data: { purchaseOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
};
