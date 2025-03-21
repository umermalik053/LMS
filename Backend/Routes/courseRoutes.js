import express from "express";
import {
  createCourse,
  deleteCourseAndLectures,
  getAllCreatorCourses,
  getAllPublishedCourse,
  getCourseByCourseId,
  getSearchCourse,
  togglePublishCourse,
  updateCourse,
} from "../controller/courseController.js";
import isAuthenticated from "../middleWare/isAuthenticated.js";
import { storage } from "../utils/multar.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, getSearchCourse);
router.route("/").get(isAuthenticated, getAllCreatorCourses);
router.route("/published").get(getAllPublishedCourse);
router
  .route("/:id")
  .put(isAuthenticated, storage.single("courseThumbnail"), updateCourse);
router.route("/:id").get(isAuthenticated, getCourseByCourseId);
router.route("/coursePublish/:id").put(isAuthenticated, togglePublishCourse);
router
  .route("/courseDelete/:courseId")
  .delete(isAuthenticated, deleteCourseAndLectures);

export default router;
