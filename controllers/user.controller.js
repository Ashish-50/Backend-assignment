const userServive = require("../service/userService.service");
const HttpException = require("../utils/httpException");
const { validationResult } = require("express-validator");

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await userServive.getUsers();
    res.status(200).json({
      success: true,
      message: "Data fetched Successfully",
      UserData: allUsers,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      throw new HttpException(422, errorMessages);
    }
    const userId = req.user._id;
    const userData = req.body;
    const udatedData = await userServive.updateUser(userId, userData);
    res.status(200).json({
      success: true,
      message: `user data updated successfully`,
      user: udatedData,
    });
  } catch (error) {
    next(error);
  }
};

const lastListenedPosition = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const audiobookId = req.params.audiobookId;
    const positionData = req.body;
    const lastListenedData = await userServive.lastListenedPosition(
      userId,
      audiobookId,
      positionData
    );
    res.status(200).json({
      success: true,
      message: `user last listened  updated successfully`,
      position: lastListenedData,
    });
  } catch (error) {
    next(error);
  }
};

const getLastListenPositionOfAudioBook = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const audioBookId = req.params.audiobookId;
    const getAudioIdLastPosition =
      await userServive.getLastListenPositionOfAudioBook(userId, audioBookId);
    res.status(200).json({
      getAudioIdLastPosition,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUser,
  lastListenedPosition,
  getLastListenPositionOfAudioBook,
};
