import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";
import notificationRouter from "./routes/notification.routes";
import orderRouter from "./routes/order.routes";
import analyticsRouter from "./routes/analytics.routes";
import layoutRouter from "./routes/layout.routes";

dotenv.config();

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.ORIGIN?.split(","),
    credentials: true,
  }),
);

// ROUTES 
app.use("/api/v1", userRouter, courseRouter, notificationRouter, orderRouter, analyticsRouter, layoutRouter);

// API HEALTH
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is Working Fine",
  });
});

// 404 Route
app.all("/*path", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route: ${req.originalUrl} not found.`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);