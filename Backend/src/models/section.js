import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);

 

















































