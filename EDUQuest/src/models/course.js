import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    thumbnail: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
