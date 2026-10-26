import jwt from "jsonwebtoken";
import { catchAsync, AppError } from "./error.middleware.js";
import {User} from "../models/user.model.js";

export const isAutheticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError("you are not logged in please login", 401);
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decodedToken.userId;

    const user = await User.findById(req.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token. Please log in again.", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError("Your token has expired. Please log in again.", 401);
    }
    throw error;
  }
});
