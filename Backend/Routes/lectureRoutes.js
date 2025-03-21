import express from 'express';
import isAuthenticated from '../middleWare/isAuthenticated.js';
import { createLecture, deleteLecture, editLecture, getCourseLecture, getLectureById } from '../controller/lectureController.js';

const router = express.Router();


router.route("/:courseId").post(isAuthenticated, createLecture )
router.route("/:courseId").get(isAuthenticated, getCourseLecture )
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture )
router.route("/delete/:lectureId").delete(isAuthenticated, deleteLecture)
router.route("/get/:lectureId").get(isAuthenticated, getLectureById)

export default router;
