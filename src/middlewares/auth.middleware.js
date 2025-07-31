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




/*
✅ Code Breakdown — verifyAccessToken

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
🔹 verifyAccessToken is a middleware:
Used to protect routes (like GET /profile, POST /todos etc.)
Runs before the controller function.
Wrap with asyncHandler() to automatically catch and forward any async errors to global error handler


1️⃣ Get Token from Cookies or Authorization Header
const token =
  req.cookies?.accessToken ||
  req.headers.authorization?.replace("Bearer ", "");

🧠 Why both?
Frontend can send token in HTTP-only cookie (req.cookies.accessToken)
Or via Authorization header (Bearer <token>)

This line covers both:
Method	Example
Cookie	accessToken=xyz123...
Authorization	Authorization: Bearer xyz123...

It first tries to get the token from cookie, then falls back to header.

2️⃣ Token Not Found?
if (!token) {
  throw new ApiError(401, "Access Token is missing or expired");
}
If token is missing (user not logged in or token expired) → return 401 Unauthorized
ApiError is your custom error class — this lets you use centralized error responses.

3️⃣ Verify Token
const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);

jwt.verify() checks:
Signature is valid (matches secret key)
Token has not expired (exp field)
If invalid or expired, throws error automatically — caught by asyncHandler

📦 After verification
decoded = {
  _id: "6488adbcf...", // user ID embedded when signing token
  username: "akash",
  email: "akash@example.com",
  iat: ..., // issued at
  exp: ...  // expiry timestamp
}
4️⃣ Find User in DB
const user = await User.findById(decoded._id);
if (!user) {
  throw new ApiError(401, "User not found with this token");
}
Why this step?
Token may be valid, but user could be deleted/deactivated.
We check DB to confirm the user still exists.
If not → throw 401.

5️⃣ Attach User to Request
req.user = user;
next(); // continue to controller
Now that user is verified, we attach the full user document to req.user.

So in any protected controller (like getMyProfile), we can simply do:

✅ Final Flow Summary

Client 🡲 /api/user/profile
         ⬇️ (middleware)
     verifyAccessToken
         ⬇️
     - Get token from cookie/header
     - Verify JWT token
     - Get user from DB
     - Attach user to req.user
         ⬇️
Controller (getMyProfile)

*/
