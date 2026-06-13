import dotenv from "dotenv";
dotenv.config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import jwt from "jsonwebtoken"

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none" | undefined;
    secure?: boolean;
}

export const signAccessToken = function (id: string): string {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "59m",
    });
}

export const signRefreshToken = function (id: string): string {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "3d",
    });
}

export const sendToken = (user: IUser, statusCode: number, res: Response, sendAccessTokenOnly: boolean) => {
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

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



    if (!sendAccessTokenOnly) {
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);
        res.status(statusCode).json({
            success: true,
            accessToken,
            refreshToken,
        });
    } else {
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.status(statusCode).json({
            success: true,
            accessToken,
        });
    }

}

