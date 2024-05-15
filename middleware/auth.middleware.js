const jwt = require("jsonwebtoken");
const HttpException = require("../utils/httpException");
const User = require("../models/user.model");
const { ACCESS_TOKEN_SECRET } = require("../config");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      throw new HttpException(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new HttpException(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const setToken = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
  });
};

const isAdminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      next(new HttpException(401, "Unauthorized"));
    }
  } catch (error) {
    next(new HttpException(401, "Unauthorized"));
  }
};

module.exports = { authMiddleware, setToken, isAdminMiddleware };
