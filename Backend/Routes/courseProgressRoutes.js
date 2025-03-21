import express from "express";
import isAuthenticated from "../middleWare/isAuthenticated.js";
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateCourseProgress } from "../controller/courseProgressController.js";



const router = express.Router();

router.route("/:courseId").get(isAuthenticated , getCourseProgress);
router.route("/:courseId/complete").post(isAuthenticated , markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated , markAsInCompleted);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated , updateCourseProgress);





export default router;