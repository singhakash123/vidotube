import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { limit } from "./constant.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();


// 📈 Rate Limiting (put early)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);


// 🔐 Security Middleware
app.use(cors({
  credentials: true,
  origin: process.env.ORIGIN || "http://localhost:3000",
}));
app.use(helmet());


// 📦 Body Parsers
app.use(express.json({ limit }));
app.use(urlencoded({ limit, extended: true }));


// 🍪 Cookie Parser
app.use(cookieParser());


// 🪵 Logger
app.use(morgan("dev"));


// 📂 Static File Serving
app.use(express.static("public"));


// ✅ Routes should come here
// app.use("/api/v1/users", userRoutes); 
// app.use("/api/v1/todos", todoRoutes); 



export {app}