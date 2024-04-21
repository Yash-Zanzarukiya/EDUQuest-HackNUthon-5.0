import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

export const Topic = mongoose.model("Topic", topicSchema);
