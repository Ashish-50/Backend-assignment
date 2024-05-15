const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/user.validator");

route.post("/register", registerValidator, authController.register);
route.post("/login", loginValidator, authController.login);
route.get("/logout", authMiddleware, authController.logout);
route.post("/refresh-token", authMiddleware, authController.refreshAccessToken);

module.exports = route;
