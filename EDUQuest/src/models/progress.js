import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);
