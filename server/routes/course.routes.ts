import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import { uploadCourse, editCourse, getSingleCourse, getAllCourses, getCourseByUser, addAnwser, addQuestion, addReviewController, addReviewReplyController } from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/add-answer", isAuthenticated, addAnwser);

courseRouter.put("/add-review/:id", isAuthenticated, addReviewController);
courseRouter.put("/add-review-reply/", isAuthenticated, authorizeRoles("admin"), addReviewReplyController);

export default courseRouter