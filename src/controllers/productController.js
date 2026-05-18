import * as productService from "../services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: { product },
    });
    console.log({ "added product": product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "error.message",
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.getProduct(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    console.log({ "product retrieved": product });
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "error.message",
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const result = await productService.getAllProduct(req.query);
    res.status(200).json({
      status: "success",
      count: result.products.length,
      totalPages: Math.ceil(result.totalProduct / result.limit),
      currentPage: result.page,
      data: { products: result.products },
    });
    console.log({ status: "got all products with pagination" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "error.message",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = await productService.updateProduct(id, data);
    if (!product) {
      console.log({ "updating product failed product not found": id });
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: { product },
    });
    console.log({ "product updated successfully": product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "error.message",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.deleteProduct(id);
    if (!product) {
      console.log({ "deleting product failed product not found": id });
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product has been successfully soft deleted",
      data: { product },
    });
    console.log("product successfully soft deleted", product);
  } catch (error) {
    console.error("error deleting product", error.message);
    res.status(500).json({
      status: "error",
      message: "error.message",
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await productService.getLowStockProducts();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error("error getting low stock products", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const product = await productService.updateStock(
      req.params.id,
      req.body.quantity,
    );
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("error updating product stock", error.message);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getExpiringProducts = async (req, res) => {
  try {
    const products = await productService.getExpiringProducts();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error("error getting expiring products", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
