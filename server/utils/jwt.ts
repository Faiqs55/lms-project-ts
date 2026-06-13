import dotenv from "dotenv";
dotenv.config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    redis.set(user._id.toString(), JSON.stringify(user) as any);

    const accessTokenExpiresIn: number = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || "300", 10);
    const refreshTokenExpiresIn: number = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "120", 10);

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 60 * 1000),
        maxAge: accessTokenExpiresIn * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
    }

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpiresIn * 60 * 60 * 1000),
        maxAge: refreshTokenExpiresIn * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
    }

    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken,
    });

}