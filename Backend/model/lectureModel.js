import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },
  publicId: {type: String},
  videoLink: {type: String },
  isPreviewFree: { type: Boolean }

},{timestamps:true});

export const lectureModel = mongoose.model("Lecture", lectureSchema);
