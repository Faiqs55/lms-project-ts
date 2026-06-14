import { Response } from "express";
import { redis } from "../utils/redis";

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