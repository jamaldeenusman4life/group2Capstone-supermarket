import express from "express";
import * as productService from "../services/productService.js";
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
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
    const product = await productService.getProduct(id);
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
    const result = await productService.getAllProduct(req.query);
    res.status(200).json({
      success: true,
      count: result.products.length,
      totalPages: Math.ceil(result.totalProduct / result.limit),
      currentPage: result.page,
      data: result.products,
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
    const data = req.body;
    const product = await productService.updateProduct(id, data);
    if (!product) {
      console.log({ "deleting product failed product not found": id });
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    res.status(200).json({
      success: true,
      message: " product updated successfully",
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
    const product = await productService.deleteProduct(id);
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
