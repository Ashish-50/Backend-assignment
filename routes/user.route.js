const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");
const { updateUserValidator } = require("../validators/user.validator");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middleware/auth.middleware");

// we can add more CRUD operation here according to the requirement I have only added those endpoints which is required as per the assignment
route.get("/", authMiddleware, isAdminMiddleware, userController.getUsers);
route.get(
  "/getlastPositionOfAudioBook/:audiobookId",
  authMiddleware,
  userController.getLastListenPositionOfAudioBook
);
route.patch(
  "/updateUser",
  authMiddleware,
  updateUserValidator,
  userController.updateUser
);
route.put(
  "/lastBookDuration/:audiobookId",
  authMiddleware,
  userController.lastListenedPosition
);

module.exports = route;
