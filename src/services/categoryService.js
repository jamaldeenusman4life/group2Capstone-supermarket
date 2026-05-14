import Category from "../models/categoryModel.js";

// Create category
const createCategory = async (categoryData) => {
  const existingCategory = await Category.findOne({
    name: categoryData.name,
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create(categoryData);
  return category;
};

// Get all categories
const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

// Get single category
const getCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

// Update category
const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

// Delete category
const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
