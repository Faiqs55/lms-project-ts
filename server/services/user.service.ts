import { Response } from "express";
import { redis } from "../utils/redis";
import UserModel from "../models/user.model";

// Get User by ID 
export const getUserById = async (id: string, res: Response) => {
    const jsonUser = await redis.get(id);
    if (jsonUser) {
        const user = JSON.parse(jsonUser)
        res.status(200).json({
            success: true,
            user
        })
    }
}

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (res:Response,id: string,role:string) => {
  const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
}