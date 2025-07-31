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