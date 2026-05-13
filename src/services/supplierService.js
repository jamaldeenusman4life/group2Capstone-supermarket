import Supplier from "../models/supplierModel.js";
import PurchaseOrder from "../models/purchaseOrderModel.js";

const createSupplier = async (supplierData) => {
  const existingSupplier = await Supplier.findOne({
    email: supplierData.email,
  });

  if (existingSupplier) {
    throw new Error("Supplier with this email already exists");
  }

  const supplier = await Supplier.create(supplierData);
  return supplier;
};

const getAllSuppliers = async () => {
  const suppliers = await Supplier.find();
  return suppliers;
};

const getSupplier = async (supplierId) => {
  const supplier = await Supplier.findById(supplierId);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

const updateSupplier = async (supplierId, updateData) => {
  const supplier = await Supplier.findByIdAndUpdate(supplierId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

const deleteSupplier = async (supplierId) => {
  const supplier = await Supplier.findByIdAndDelete(supplierId);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

const createPurchaseOrder = async (purchaseOrderData) => {
  const supplier = await Supplier.findById(purchaseOrderData.supplier);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  const purchaseOrder = await PurchaseOrder.create(purchaseOrderData);
  return purchaseOrder;
};

const getAllPurchaseOrders = async () => {
  const purchaseOrders = await PurchaseOrder.find()
    .populate("supplier", "name email")
    .populate("products.product", "name price");
  return purchaseOrders;
};

const updatePurchaseOrderStatus = async (purchaseOrderId, status) => {
  const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    { status },
    { new: true },
  );

  if (!purchaseOrder) {
    throw new Error("Purchase order not found");
  }

  return purchaseOrder;
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
