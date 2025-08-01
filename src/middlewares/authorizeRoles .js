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

