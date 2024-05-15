const User = require("../models/user.model");
const { body } = require("express-validator");

const registerValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        return Promise.reject("Email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("The minimum password length is 6 characters"),
  body("role").optional().isString(),
  body("playbackPreference").optional().isObject(),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateUserValidator = [
  body("username").optional().notEmpty().withMessage("Username is required"),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("The minimum password length is 6 characters"),
  body("role").optional().isString(),
  body("playbackPreference").optional().isObject(),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateUserValidator,
};
