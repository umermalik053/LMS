import { courseModel } from "../model/courseModel.js";
import { lectureModel } from "../model/lectureModel.js";
import { deletevideo } from "../utils/cloudinary.js";

const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const courseId = req.params.courseId;
    if (!lectureTitle) {
      return res.status(404).json({
        status: 404,
        message: "Lecture title and course id are required",
        data: lectureTitle,
      });
    }
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    const lecture = await lectureModel.create({ lectureTitle });

    course.lecture.push(lecture._id);
    await course.save();

    res.status(201).json({
      status: 201,
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to create lecture",
    });
  }
};

const getCourseLecture = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseModel.findById(courseId).populate("lecture");

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Course lectures retrieved successfully",
      data: course.lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to get course lectures",
    });
  }
};

const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        status: 404,
        message: "Lecture not found",
      });
    }
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo.videoUrl) lecture.videoLink = videoInfo.videoUrl;
    if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;
    await lecture.save();

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    if (course.lecture && !course.lecture.includes(lecture._id)) {
      course.lecture.push(lecture._id);
      await course.save();
    }
    res.status(200).json({
      status: 200,
      message: "Lecture updated successfully",
      data: lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to update lecture",
    });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const {lectureId} = req.params;
    const lecture = await lectureModel.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        status: 404,
        message: "Lecture not found",
      });
    }
  //  delete lecture from cloudinary
    if(lecture.publicId){
      await deletevideo(lecture.publicId)
    }
    // remove lecture id from course's lecture array

    await courseModel.updateOne(
      { lecture: lectureId },
      { $pull: { lecture: lectureId } }
    );
    
    return res.status(200).json({
      status: 200,
      message: "Lecture deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to delete lecture",
    });
    
  }
}

const getLectureById = async (req,res)=>{
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    if(!lecture){
      return res.status(404).json({
        status: 404,
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Lecture retrieved successfully",
      data: lecture,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to get lecture by id",
    });
    
  }
}

export { createLecture, getCourseLecture, editLecture, deleteLecture, getLectureById};
