import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { createOrderController, getAllOrders } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrderController);
orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default orderRouter;