const categoryService = require("../service/category.service");
const HttpException = require("../utils/httpException");

const createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const category = await categoryService.createCategory(categoryData);
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Successfully fetched all categories",
      categories: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryService.getCategoryById(categoryId);
    res.status(200).json({
      success: true,
      message: `Successfully fetched category for this Id ${categoryId}`,
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const categoryData = req.body;
    const category = await categoryService.updateCategoryById(
      categoryId,
      categoryData
    );
    res.status(200).json({
      success: true,
      message: `Category data updated successfully`,
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    await categoryService.deleteCategoryById(categoryId);
    res.status(200).json({
      success: true,
      message: `Category with Id ${categoryId} deleted from records`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
