import express from "express";
import Product from "../models/productsModel.js";
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
    console.log({ "added product": product });
  } catch (error) {
    console.log({ "error creating product": error.message });
    return res
      .status(500)
      .json({ success: false, message: "Please try again later" });
  }
};
export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ id: id, isDeleted: false })
      .populate("Category", "name description")
      .populate("supplier", "name ");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log({ "product retrieved": product });
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "please try again later" });
    console.log({ "error getting a product": error.message });
  }
};
export const getAllProduct = async (req, res) => {
  try {
    let { page, limit, sort, category, minPrice, maxPrice } = req.query;
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
    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProduct / limit),
      currentPage: page,
      data: products,
    });
    console.log({ success: "got all products with pagination" });
  } catch (error) {
    res.status(500).json({ success: false, message: "please try again later" });
    console.log({ "error getting all products": error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!product) {
      console.log({ "deleting product failed product not found": id });
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    res.status(200).json({
      success: true,
      message: "product product updated successfully",
      data: product,
    });
    console.log({ "product updated successfully": product });
  } catch (error) {
    res.status(500).json({ success: false, message: "please try again later" });
    console.log({ "error updating product": error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    if (!product) {
      console.log({ "deleting product failed product not found": id });
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product has been successfully soft deleted",
      data: product,
    });
    console.log("product successfully soft deleted", product);
  } catch (error) {
    res.status(500).json({ success: false, message: "please try again later" });
    console.log("error deleting product", error.message);
  }
};
