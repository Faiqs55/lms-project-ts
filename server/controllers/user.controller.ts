import dotenv from "dotenv";
import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "node:path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";
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


    sendToken(user, 200, res, false);

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// User Logout
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.cookie("access_token", "", { maxAge: 1 });
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


// Refresh access Token 
export const refreshAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new ErrorHandler("Session expired", 400));
    }

    const user: IUser = JSON.parse(session);

    req.user = user;


    return sendToken(user, 200, res, true);

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
});


// Get User Info 
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.user?._id;
    getUserById(id?.toString() || "", res)
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})


// Social Auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string
}

export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await UserModel.findOne({ email });

    if (!user) {
      const newUser = await UserModel.create({ email, name, avatar: { url: avatar } });
      sendToken(newUser, 200, res, true);
    } else {
      sendToken(user, 200, res, true);
    }


  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
});


// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user = await UserModel.findById(userId);

      if (user && email) {
        const isEmailExist = await UserModel.findOne({ email });
        if (!isEmailExist) {
          user.email = email
        } else {
          return next(new ErrorHandler("Email Already Exists.", 400))
        }
      }


      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId?.toString() || "", JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await UserModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id.toString() || "", JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);




// update profile picture
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await UserModel.findById(userId).select("+password");

      if (avatar && user) {
        // if user have one avatar then call this if
        if (user?.avatar?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      await redis.set(userId?.toString() as string, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);