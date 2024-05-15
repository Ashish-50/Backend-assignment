const User = require("../models/user.model");
const HttpException = require("../utils/httpException");

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new HttpException(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = async (userData) => {
  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new HttpException(
      500,
      "Something went wrong while registering the user"
    );
  }
  return createdUser;
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpException(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new HttpException(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return { loggedInUser, accessToken, refreshToken };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new HttpException(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new HttpException(401, "Refresh token is expired or used");
  }

  const { accessToken, newRefreshToken } =
    await generateAccessAndRefereshTokens(user._id);
  return { accessToken, newRefreshToken };
};

module.exports = { registerUser, loginUser, refreshAccessToken };
