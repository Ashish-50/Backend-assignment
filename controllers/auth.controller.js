const { validationResult } = require("express-validator");
const authService = require("../service/auth.service");
const { setToken } = require("../middleware/auth.middleware");
const HttpException = require("../utils/httpException");

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      throw new HttpException(422, errorMessages);
    }
    const userData = req.body;
    const createdUser = await authService.registerUser(userData);
    res.status(201).json({
      success: true,
      message: "account created",
      UserData: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      throw new HttpException(422, errorMessages);
    }
    const loginData = req.body;
    const { loggedInUser, accessToken, refreshToken } =
      await authService.loginUser(loginData);
    setToken(res, { accessToken, refreshToken });
    res.status(200).json({
      sucess: true,
      message: "User logged In",
      user: { loggedInUser, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new HttpException(400, "Refresh token is missing");
    }
    const { accessToken, refreshToken } =
      await authService.refreshAccessToken(incomingRefreshToken);
    setToken(res, { accessToken, refreshToken });
    res.status(200).json({
      sucess: true,
      message: "Access token refreshed",
      accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.setHeader("Authorization", "");
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
};
