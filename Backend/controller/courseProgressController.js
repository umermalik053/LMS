import { courseModel } from "../model/courseModel.js";
import { courseProgressModel } from "../model/courseProgress.js";

const getCourseProgress = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    let courseProgress = await courseProgressModel
      .findOne({ userId, courseId })
      .populate("courseId");

    const courseDetail = await courseModel.findById(courseId).populate("lecture");
    if (!courseDetail) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        status: 200,
        message: "Course progress not found",
        data: [],
        courseDetail,
        completed: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Course progress fetched successfully",
      data: courseProgress.lectureProgress,
      courseDetail,
      completed: courseProgress.completed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch course progress",
    });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId, lectureId } = req.params;

    let courseProgress = await courseProgressModel.findOne({
      userId,
      courseId,
    });
    if (!courseProgress) {
      courseProgress = await new courseProgressModel({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lp) => lp.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;

    const course = await courseModel.findById(courseId);
    if (lectureProgressLength === course.lecture.length) {
      courseProgress.completed = true;
    }
    await courseProgress.save();
    return res.status(200).json({
      status: 200,
      message: "Course progress updated successfully",
      courseProgress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to update course progress",
    });
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    let courseProgress = await courseProgressModel.findOne({
      userId,
      courseId,
    });
    if (!courseProgress) {
      return res.status(404).json({
        status: 404,
        message: "Course progress not found",
      });
    }
    courseProgress.lectureProgress.map((lecture) => {
      lecture.viewed = true;
    });
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({
      status: 200,
      message: "Course progress marked as completed successfully",
      courseProgress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to mark course as completed",
    });
  }
};
const markAsInCompleted = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    let courseProgress = await courseProgressModel.findOne({
      userId,
      courseId,
    });
    if (!courseProgress) {
      return res.status(404).json({
        status: 404,
        message: "Course progress not found",
      });
    }
    courseProgress.lectureProgress.map((lecture) => {
      lecture.viewed = false;
    });
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({
      status: 200,
      message: "Course progress marked as incompleted.",
      courseProgress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to mark course as completed",
    });
  }
};

export {
  getCourseProgress,
  updateCourseProgress,
  markAsCompleted,
  markAsInCompleted,
};
