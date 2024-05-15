const User = require("../models/user.model");
const HttpException = require("../utils/httpException");
const AudioBookProgress = require("../models/audioBookProgress.model");
const mongoose = require("mongoose");
const audioBookModel = require("../models/audioBook.model");

const getUsers = async () => {
  const users = await User.find({}).select("-password -refreshToken");
  if (!users) {
    throw new HttpException(404, "No Record found");
  }
  return users;
};

const updateUser = async (userId, userData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    throw new HttpException(404, `User not found with ID ${userId}`);
  }
  return updatedUser;
};

const lastListenedPosition = async (userId, audiobookId, positionData) => {
  const position = await AudioBookProgress.findOneAndUpdate(
    { userId, audiobookId },
    { $set: { duration: positionData.duration } },
    { upsert: true, new: true }
  );
  if (!position) {
    throw new HttpException(
      500,
      "Something went wrong while adding the lastListened position"
    );
  }
  return position;
};

const getLastListenPositionOfAudioBook = async (userId, audiobookId) => {
  const getPosition = await AudioBookProgress.findOne({
    userId,
    audiobookId,
  }).populate("audiobookId", "title author duration audioUrl");
  return getPosition;
};

module.exports = {
  getUsers,
  updateUser,
  lastListenedPosition,
  getLastListenPositionOfAudioBook,
};
