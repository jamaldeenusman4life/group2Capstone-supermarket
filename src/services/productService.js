import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/userModel.js";

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

// Get low stock products
export const getLowStockProducts = async () => {
  const products = await Product.find({
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
  });
  return products;
};

// Update stock
export const updateStock = async (productId, quantity) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { quantity },
    { new: true },
  );
  if (!product) {
    throw new Error("Product not found");
  }

  try {
    if (product.quantity <= product.lowStockThreshold) {
      // Get all admins
      const admins = await User.find({ role: "admin" }).select("email name");

      await Promise.all(
        admins.map((admin) =>
          sendEmail({
            to: admin.email,
            subject: `⚠️ Low Stock Alert — ${product.name}`,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #E74C3C; text-align: center;">⚠️ Low Stock Alert</h2>
            <p>Hi <strong>${admin.name}</strong>,</p>
            <p>A product in your inventory is running low on stock.</p>
            <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #E74C3C;">
              <h3 style="color: #E74C3C;">Product Details:</h3>
              <p><strong>Product Name:</strong> ${product.name}</p>
              <p><strong>Current Stock:</strong> ${product.quantity}</p>
              <p><strong>Low Stock Threshold:</strong> ${product.lowStockThreshold}</p>
            </div>
            <p>Please restock this product as soon as possible.</p>
            <p style="color: #888; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
          </div>
        `,
          }),
        ),
      );
    }
  } catch (emailError) {
    console.error("Low stock email failed:", emailError.message);
  }

  return product;
};

// Get expiring products
export const getExpiringProducts = async () => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const products = await Product.find({
    expiryDate: { $lte: sevenDaysFromNow },
  });
  return products;
};
