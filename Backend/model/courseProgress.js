import mongoose from "mongoose";

const lectureProgressSchema = mongoose.Schema({
  lectureId: { type: "string" },
  viewed: { type: "boolean" , default: false },

});

const courseProgressSchema = mongoose.Schema({
    userId:{ type: "string" },
    courseId:{ type: "string" },
    lectureProgress: [lectureProgressSchema],
    completed: { type: "boolean", default: false },

})

export const courseProgressModel = mongoose.model("CourseProgress", courseProgressSchema);