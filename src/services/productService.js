import Product from "../models/productsModel.js";

export const createProduct = async (data) => {
  const result = await Product.create(data);
  return result;
};
export const getProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate("category", "name description")
    .populate("supplier", "name ");
  return product;
};
export const getAllProduct = async (queryParams) => {
  let { page, limit, sort, category, minPrice, maxPrice } = queryParams;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  const queryObj = { isDeleted: false };
  if (category) queryObj.category = category;
  if (minPrice || maxPrice) {
    queryObj.price = {};
    if (minPrice) queryObj.price.$gte = Number(minPrice);
    if (maxPrice) queryObj.price.$lte = Number(maxPrice);
  }
  const products = await Product.find(queryObj)
    .populate("category", "name")
    .populate("supplier", "name")
    .sort(sort ? sort : "-createdAt")
    .limit(limit)
    .skip(skip);
  const totalProduct = await Product.countDocuments(queryObj);
  return { products, totalProduct, page, limit };
};
export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
  return product;
};
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true },
  );
  return product;
};
