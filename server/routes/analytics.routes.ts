import express from "express";
import { getCoursesAnalytics, getOrderAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const analyticsRouter = express.Router();


analyticsRouter.get("/get-users-analytics", isAuthenticated, authorizeRoles("admin"), getUsersAnalytics);

analyticsRouter.get("/get-orders-analytics", isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);

analyticsRouter.get("/get-courses-analytics", isAuthenticated, authorizeRoles("admin"), getCoursesAnalytics);


export default analyticsRouter;