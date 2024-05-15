const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middleware/auth.middleware");

route.post(
  "/",
  authMiddleware,
  isAdminMiddleware,
  categoryController.createCategory
);
route.get("/", authMiddleware, categoryController.getAllCategories);
route.get(
  "/getCategoryById/:categoryId",
  authMiddleware,
  categoryController.getCategoryById
);
route.patch(
  "/updateCategory/:categoryId",
  authMiddleware,
  isAdminMiddleware,
  categoryController.updateCategoryById
);
route.delete(
  "/deleteCategory/:categoryId",
  authMiddleware,
  isAdminMiddleware,
  categoryController.deleteCategoryById
);

module.exports = route;
