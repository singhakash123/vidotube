import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// This middleware decodes the JWT and finds the user from DB and attaches it to req.user
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // 1️⃣ Get token from cookie or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access Token is missing or expired");
  }

  // 2️⃣ Verify token
  const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);

  // 3️⃣ Attach user to req
 const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "User not found with this token");
  }

  req.user = user;
  next(); // continue to controller
});


/*
❌ Mistakes:
error.name = "TokenExpiredError" ❌
→ This is an assignment, not a comparison. Use === instead.

replace("Bearer", "")
→ You missed the space → should be "Bearer " (with a space)
*/





