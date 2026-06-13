import dotenv from "dotenv";
import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "node:path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
dotenv.config();

// Register User
interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email Already Exist.", 400));
      }

      const user: IRegisterationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data,
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your Account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Activation code has been sent to ${user.email}`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "15m" },
  );
  return { token, activationCode };
};

// User Activation

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(
          new ErrorHandler("Invalid Activation Code, Try Again.", 400),
        );
      }

      const { name, email, password } = newUser.user;

      const isUserExist = await UserModel.findOne({ email });

      if (isUserExist) {
        return next(new ErrorHandler("Email Already Exist.", 400));
      }

      const user = await UserModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);


// Login User
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }

    sendToken(user, 200, res);

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// User Logout
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("refreshToken", "", {maxAge: 1});
    res.cookie("access_token", "", {maxAge: 1});
    const userId = req.user?._id || "";

    redis.del(userId.toString())

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
