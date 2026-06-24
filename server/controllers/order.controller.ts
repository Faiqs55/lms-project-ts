import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { IOrder } from "../models/order.model";
import UserModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import ejs from "ejs";
import path from "node:path";
import sendMail from "../utils/sendMail";
import { redis } from "../utils/redis";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// Create Order 
export const createOrderController = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, paymentInfo } = req.body as IOrder;

        if (paymentInfo) {
        if ("id" in paymentInfo) {
          const paymentIntentId = paymentInfo.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }
        }
      }

        const user = await UserModel.findById(req?.user?._id);
        const courseAlreadyPurchased = user?.courses.some((course: any) => course._id.toString() === courseId.toString());

        if (courseAlreadyPurchased) {
            return next(new ErrorHandler("Course already purchased by user.", 400))
        }

        const course: ICourse | null = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not Found.", 404));
        }

        const data: any = {
            courseId,
            userId: user?._id,
            paymentInfo
        }

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            }
        };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }

        user?.courses.push({ courseId: course._id.toString() });
        await redis.set(user?._id.toString() || "", JSON.stringify(user));

        await user?.save();

        await NotificationModel.create({
            userId: user?._id.toString() as string,
            title: "New Order",
            message: `You have a new order from ${course.name}`
        });

        course.purchased = course.purchased + 1;

        await course.save();

        newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// get All orders 
export const getAllOrders = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllOrdersService(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);


//  send stripe publishble key
export const sendStripePublishableKey = CatchAsyncErrors(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        description: "E-learning course services",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
        shipping: {
          name: "Harmik Lathiya",
          address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        },
      });
      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);