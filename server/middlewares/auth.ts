import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { refreshAccessToken } from "../controllers/user.controller";

export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token as string;

      if (!access_token) {
        return next(new ErrorHandler("User not Authenticated", 403));
      }

      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN_SECRET as string,
        ) as JwtPayload;
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          decoded = jwt.decode(access_token) as JwtPayload;
        } else {
          throw err;
        }
      }

      if (!decoded) {
        return next(new ErrorHandler("Access Token is not Valid", 403));
      }

      // check if the access token is expired
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {

        try {
          const refresh_token = req.cookies.refresh_token;

          if (!refresh_token) {
            return next(new ErrorHandler("Refresh token not found", 403));
          }

          const decoded_refresh = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET as string,
          ) as JwtPayload;

          const session = await redis.get(decoded_refresh.id);

          if (!session) {
            return next(new ErrorHandler("Session expired", 400));
          }

          const user = JSON.parse(session);
          req.user = user;

          return next();
        } catch (refreshError: any) {
          return next(new ErrorHandler(refreshError.message, 500));
        }
      } else {
        const user = await redis.get(decoded.id);

        if (!user) {
          return next(
            new ErrorHandler("Please login to access this resource", 400),
          );
        }

        req.user = JSON.parse(user);

        next();
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this ressourse`,
          403,
        ),
      );
    }
    next();
  };
};
