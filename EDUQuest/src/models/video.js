import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    summary: {
      type: String,
      // required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
