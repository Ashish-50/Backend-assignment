const Category = require("../models/category.model");
const HttpException = require("../utils/httpException");

const createCategory = async (categoryData) => {
  const { name } = categoryData;
  if (!name) {
    throw new HttpException(400, "Name field is required");
  }
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new HttpException(409, "Category with this name already exists");
  }
  const category = await Category.create({
    name,
  });
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new HttpException(404, `No category found for this ${categoryId}`);
  }
  return category;
};

const updateCategoryById = async (categoryId, categoryData) => {
  const category = await Category.findByIdAndUpdate(categoryId, categoryData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new HttpException(404, `No category found for this ${categoryId}`);
  }
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new HttpException(404, `No category found for this ${categoryId}`);
  }
  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
