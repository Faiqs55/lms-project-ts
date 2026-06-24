import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { createOrderController, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrderController);
orderRouter.get("/get-all-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);
orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;