import mongoose, { isValidObjectId } from "mongoose";
import { Progress } from "../models/progress.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleProgressStatus = asyncHandler(async (req, res) => {
  const { courseId, videoId } = req.params;
  if (!isValidObjectId(courseId) || !isValidObjectId(videoId))
    throw new APIError(400, "all required");

  const progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
    video: videoId,
  });

  if (!progress) {
    const newProgress = await Progress.create({
      user: req.user._id,
      course: courseId,
      video: videoId,
    });
    if (!newProgress) throw new APIError(400, "error occurred");
  } else {
    const deletedProgress = await Progress.findByIdAndDelete(progress._id);
    if (!deletedProgress) throw new APIError(400, "error occurred");
  }

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { isCompleted: !progress },
        "progress toggled successfully"
      )
    );
});

const createProgressStatus = asyncHandler(async (req, res) => {
  const { courseId, videoId } = req.params;
  if (!isValidObjectId(courseId) || !isValidObjectId(videoId))
    throw new APIError(400, "all required");

  return res
    .status(200)
    .json(new APIResponse(200, {}, "Video createProgressStatus successfully"));
});

export { toggleProgressStatus, createProgressStatus };
