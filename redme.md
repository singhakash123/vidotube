## How to setup a professional backend project

project-root/
│
├── .env # Environment variables
├── .env.sample # Sample env for developers
├── .gitignore # Ignore node_modules, logs, etc.
├── .prettierrc # Code formatter config
├── .prettierignore # Ignore files for prettier
├── package.json # Project metadata and scripts
│
├── public/ # Public assets or uploads
├── temp/ # Temporary files (keep with .gitkeep)
│
└── src/
├── index.js # Entry point (start server, connect DB)
├── app.js # Main express app (routes, middleware load)

    ├── db /
    |     └── index.js   # Database connection logic

    ├── config/                 # 💡 All configs here
    │   └── cloudinary.js       # Cloudinary config
    │   └── logger.js           # Winston or custom logger
    │   └── rateLimiter.js      # Security middlewares (rate limit etc)

    ├── models/                 # Mongoose schema definitions
    │   └── user.model.js
    │   └── todo.model.js

    ├── controllers/           # Request handlers / business logic
    │   └── auth.controller.js
    │   └── user.controller.js

    ├── routes/                # All routes
    │   └── auth.routes.js
    │   └── user.routes.js
    │   └── index.js           # Route aggregator

    ├── middlewares/          # Custom middlewares
    │   └── auth.middleware.js
    │   └── error.middleware.js
    │   └── upload.middleware.js
    │   └── authorizeRoles.js

    ├── services/             # 💡 Business-level services (optional)
    │   └── user.service.js    # Logic abstracted from controllers

    ├── utils/                # Utility functions
    │   └── ApiError.js
    │   └── ApiResponse.js
    │   └── asyncHandler.js
    │   └── sendEmail.js

    ├── constants/            # Centralized enums / roles / messages
    │   └── roles.js
    │   └── messages.js

    ├── validators/           # 🛡 Joi or express-validator schemas
    │   └── user.validator.js
    │
    ├── docs/                 # Swagger/OpenAPI docs if any
    │   └── swagger.yaml
    │
    └── tests/                # Jest or supertest-based tests
        └── auth.test.js

## ✅ Why this structure is better?

Layer Purpose
config/ All external service configs in one place
services/ Separation of concerns: logic outside controllers
validators/ Input validation separated from business logic
constants/ Easy update and readability for enums, role names, status messages etc.
docs/ Swagger or Postman specs, centralised docs
temp/ Placeholder for temporary data (keep clean with .gitkeep)

## Use .gitkeep to preserve empty directories in Git.

## Configure Scripts & Imports

-- Use nodemon for auto-restarting during development ("dev": "nodemon src/index.js").
-- Implement ES modules or CommonJS consistently across the project.

## Initial Git Workflow

-- After setup, commit and push remote origin.

## Verify files on GitHub to ensure clean version control practices.

------------------------------------- How to connect database in MERN with debugging --------------------------------------------------##

verifyAccessToken → finds the user and sets req.user

## This middleware decodes the JWT and finds the user from DB and attaches it to req.user

## export const verifyAccessToken = asyncHandler(async (req, res, next) => {

-- 1️⃣ Get token from cookie or Authorization header
const token =
req.cookies?.accessToken ||
req.headers.authorization?.replace("Bearer ", "");

if (!token) {
throw new ApiError(401, "Access Token is missing or expired");
}

// 2️⃣ Verify token
const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);

// 3️⃣ Attach user to req
const user = await User.findById(decoded.\_id);
if (!user) {
throw new ApiError(401, "User not found with this token");
}

req.user = user;
next(); // continue to controller
});

## ✅ Code Breakdown — verifyAccessToken

## export const verifyAccessToken = asyncHandler(async (req, res, next) => {

           🔹 verifyAccessToken is a middleware:
               Used to protect routes (like GET /profile, POST /todos etc.)
               Runs before the controller function.
                Wrap with asyncHandler() to automatically catch and forward any async errors to global error handler

### 1️⃣ Get Token from Cookies or Authorization Header

               const token =
                         req.cookies?.accessToken ||
                         req.headers.authorization?.replace("Bearer ", "");

                           🧠 Why both?
                        Frontend can send token in HTTP-only cookie (req.cookies.accessToken)
                        Or via Authorization header (Bearer <token>)

                        This line covers both:
                                  Method               Example
                                   Cookie              accessToken=xyz123...
                                   Authorization       Authorization: Bearer xyz123...

-- It first tries to get the token from cookie, then falls back to header.

### 2️⃣ Token Not Found?

                                  if (!token) {
                                           throw new ApiError(401, "Access Token is missing or expired");
                                       }
                                 -- If token is missing (user not logged in or token expired) → return 401 Unauthorized
                                 -- ApiError is your custom error class — this lets you use centralized error responses.

## 3️⃣ Verify Token

                                   const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);

                                     jwt.verify() checks:
                                     Signature is valid (matches secret key)
                                     Token has not expired (exp field)
                                    If invalid or expired, throws error automatically — caught by asyncHandler

                          📦 After verification
                            decoded = {
                                     \_id: "6488adbcf...", // user ID embedded when signing token
                                        username: "akash",
                                        email: "akash@example.com",
                                        iat: ..., // issued at
                                        exp: ... // expiry timestamp
                                    }

## 4️⃣ Find User in DB

              const user = await User.findById(decoded.\_id);
                        if (!user) {
                            throw new ApiError(401, "User not found with this token");
                             }
                          Why this step?
                           Token may be valid, but user could be deleted/deactivated.
                             We check DB to confirm the user still exists.
                            If not → throw 401.

## 5️⃣ Attach User to Request

                   req.user = user;
                    next(); // continue to controller
                     Now that user is verified, we attach the full user document to req.user.

                      So in any protected controller (like getMyProfile), we can simply do:

✅ Final Flow Summary

Client 🡲 /api/user/profile
⬇️ (middleware)
verifyAccessToken
⬇️ - Get token from cookie/header - Verify JWT token - Get user from DB - Attach user to req.user
⬇️
Controller (getMyProfile)

\*/

## authorizeRoles → reads req.user.role and checks if it's allowed

import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
return (req, \_ , next) => {
const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next(); // allow access

};
};
/\*

authorizeRoles("ADMIN")
authorizeRoles("SELLER", "EDITOR")
authorizeRoles("USER", "ADMIN", "MOD")

_/
/_
// constants/roles.js
export const ROLES = {
USER: "user",
ADMIN: "admin",
MODERATOR: "moderator"
};

Then use: authorizeRoles(ROLES.ADMIN)
_/
/_
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

_/
/_
const userRole = req.user?.role;

✅ Full Flow: How req.user?.role Works
🔐 1. User Logs In
When a user logs in, we generate a JWT access token that includes their \_id (or even role if you want).
// payload inside JWT
const token = jwt.sign({ \_id: user.\_id }, process.env.SECRET_KEY);

🛡️ 2. verifyAccessToken Middleware
This middleware decodes the JWT and finds the user from DB and attaches it to req.user

// middlewares/auth.middleware.js
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

if (!token) {
throw new ApiError(401, "Token missing");
}

const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);
const user = await User.findById(decoded.\_id); // Find user from DB

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
verifyAccessToken, // ✅ Adds req.user
authorizeRoles("admin"), // ✅ Reads req.user.role
(req, res) => {
res.send("Admin access granted");
}
);
So:

verifyAccessToken → finds the user and sets req.user
authorizeRoles → reads req.user.role and checks if it's allowe

\*/
