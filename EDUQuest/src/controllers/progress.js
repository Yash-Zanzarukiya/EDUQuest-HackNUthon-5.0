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

  if (!progress) throw new APIError(400, "course not found");
  console.log("progress: ", progress);

  progress.isCompleted = !progress.isCompleted;
  console.log("progress: ", progress);
  const updatedCourse = await progress.save({ validateBeforeSave: false });

  if (!updatedCourse) throw new APIError(400, "Error while toggling");

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { isCompleted: updatedCourse.isCompleted },
        "Video toggled successfully"
      )
    );
});

const createProgressStatus = asyncHandler(async (req, res) => {
  const { courseId, videoId } = req.params;
  if (!isValidObjectId(courseId) || !isValidObjectId(videoId))
    throw new APIError(400, "all required");

  const progress = await Progress.create({
    user: req.user._id,
    course: courseId,
    video: videoId,
  });

  if (!progress) throw new APIError(400, "course not found");

  return res
    .status(200)
    .json(new APIResponse(200, progress, "Video createProgressStatus successfully"));
});

export { toggleProgressStatus, createProgressStatus };
