import { courseModel } from "../model/courseModel.js";
import { lectureModel } from "../model/lectureModel.js";
import { userModel } from "../model/userModel.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category, coursePrice } = req.body;
    if (!courseTitle || !category) {
      return res.status(404).json({
        status: 404,
        message: "All fields are required",
      });
    }
    const course = await courseModel.create({
      courseTitle,
      category,
      coursePrice,
      creator: req.id,
    });
    return res.status(201).json({
      status: 201,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to create course",
    });
  }
};

const getAllCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await courseModel.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        status: 404,
        message: "No courses found for this user",
        data: [],
      });
    }
    return res.status(200).json({
      status: 200,
      message: "All courses",
      data: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch all courses",
    });
  }
};

const getSearchCourse = async (req, res) => {
  try {
    const { query = "", category = [], sortByPrice = "" } = req.query;

    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    // if category are selected
    if (category.length) {
      searchCriteria.category = { $in: category };
    }

    // if sort by price is selected
    const sortoptions = {};
    if (sortByPrice === "low") {
      sortoptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortoptions.coursePrice = -1;
    }
    // fetch courses
    const courses = await courseModel
      .find(searchCriteria)
      .populate({ path: "creator", select: "name photoURL" })
      .sort(sortoptions);

    return res.status(200).json({
      status: 200,
      message: "Search courses",
      data: courses || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to search courses",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const data = req.body;
    const thumbnail = req.file;
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
        data: null,
      });
    }
    let CourseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicID = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMedia(publicID);
      }
      CourseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updatedData = {
      ...course._doc,
      courseTitle: data.courseTitle || course.courseTitle,
      subTitle: data.subTitle || course.subTitle,
      category: data.category || course.category,
      description: data.description || course.description,
      coursePrice: data.coursePrice || course.coursePrice,
      courseThumbnail: CourseThumbnail
        ? CourseThumbnail?.secure_url
        : course.courseThumbnail,
      courseLevel: data.courseLevel || course.courseLevel,
    };
    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      updatedData,
      { new: true }
    );
    return res.status(200).json({
      status: 200,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to update course",
    });
  }
};

const getCourseByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
        data: null,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Course found",
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch course",
    });
  }
};

// publish and unpublish a course

const togglePublishCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { publish } = req.query;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
        data: null,
      });
    }
    if (course.lecture.length == 0) {
      return res.status(400).json({
        status: 400,
        message: "Cannot publish a course atleast one lecture required",
        data: null,
      });
    }
    course.isPublished = publish === "true";
    await course.save();
    return res.status(200).json({
      status: 200,
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      } successfully`,
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to publish course",
    });
  }
};

const deleteCourseAndLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Step 1: Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Delete related lectures
    await lectureModel.deleteMany({ _id: { $in: course.lecture } });

    // 🚀 Step 3: Remove course from enrolledCourses of all users
    await userModel.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    // Step 3: Delete the course
    await courseModel.findByIdAndDelete(courseId);

    res
      .status(200)
      .json({ message: "Course and its lectures deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to delete course and lectures",
    });
  }
};

const getAllPublishedCourse = async (_, res) => {
  try {
    const courses = await courseModel
      .find({ isPublished: true })
      .populate({ path: "creator", select: "name photoURL" });
    if (!courses) {
      return res.status(404).json({
        status: 404,
        message: "No published courses found",
        data: [],
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Published courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch published courses",
    });
  }
};

export {
  createCourse,
  getAllCreatorCourses,
  updateCourse,
  getCourseByCourseId,
  togglePublishCourse,
  deleteCourseAndLectures,
  getAllPublishedCourse,
  getSearchCourse,
};
