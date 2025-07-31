import { ApiError } from "../utils/ApiError.js";
export const authorizeRoles = (...allowedRoles) => {
  return (req, _ , next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next(); // allow access
  };
};

/*

authorizeRoles("ADMIN")
authorizeRoles("SELLER", "EDITOR")
authorizeRoles("USER", "ADMIN", "MOD")

*/
/*
// constants/roles.js
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator"
};

Then use: authorizeRoles(ROLES.ADMIN)
*/
/*
router.get(
  "/admin-or-mod-access",
  verifyAccessToken,
  authorizeRoles("admin", "moderator"), // Both can access
  (req, res) => {
    res.send("Hello Admin or Moderator");
  }
);

 How it works:
verifyAccessToken: ensures user is logged in and sets req.user.
authorizeRoles("admin"): checks if req.user.role === "admin".
If not, throws 403 Forbidden.

*/
/*
const userRole = req.user?.role;

✅ Full Flow: How req.user?.role Works
🔐 1. User Logs In
When a user logs in, we generate a JWT access token that includes their _id (or even role if you want).
// payload inside JWT
const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

🛡️ 2. verifyAccessToken Middleware
This middleware decodes the JWT and finds the user from DB and attaches it to req.user

// middlewares/auth.middleware.js
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);
  const user = await User.findById(decoded._id); // Find user from DB

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user; // 👈 THIS IS THE KEY STEP
  next();
});

🎯 3. Now req.user is Available
Once you add req.user = user, any middleware or controller after that has access to the full user object.

const userRole = req.user?.role;
You're safely accessing the user role using optional chaining (?.) to avoid crashing if req.user is undefined.
router.get(
  "/admin-only",
  verifyAccessToken,         // ✅ Adds req.user
  authorizeRoles("admin"),   // ✅ Reads req.user.role
  (req, res) => {
    res.send("Admin access granted");
  }
);
So:

verifyAccessToken → finds the user and sets req.user
authorizeRoles → reads req.user.role and checks if it's allowe
*/