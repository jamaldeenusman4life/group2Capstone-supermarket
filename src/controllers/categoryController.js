import * as categoryService from "../services/categoryService.js";
const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategory(req.params.id);
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
