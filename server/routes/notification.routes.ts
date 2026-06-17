import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { getAllNotificationsController, updateNotificationController } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get("/get-notifications", isAuthenticated, authorizeRoles("admin"), getAllNotificationsController);
notificationRouter.put("/update-notification/:id", isAuthenticated, authorizeRoles("admin"), updateNotificationController);

export default notificationRouter;