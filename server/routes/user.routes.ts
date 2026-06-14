import express from "express";
import { activateUser, registerUser, loginUser, logoutUser, refreshAccessToken, getUserInfo, socialAuth, updateUserInfo } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", refreshAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/socialauth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

export default userRouter;