import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import NotificationModel from "../models/notification.model";
import cron from "node-cron";

// Get all notifications
export const getAllNotificationsController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// Update Notifications
export const updateNotificationController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificaiton = await NotificationModel.findById(req.params.id);
        if (!notificaiton) {
            return next(new ErrorHandler("Notification not found.", 404))
        }

        notificaiton.status = "read";

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notifications,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// Delete Read notifications 
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
    console.log("Deleted Read Notifications");
})