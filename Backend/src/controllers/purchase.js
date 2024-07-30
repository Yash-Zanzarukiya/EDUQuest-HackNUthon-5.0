import { Purchase } from "../models/purchase.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) throw new APIError(400, "all required");

  const course = await Purchase.create({
    lerner: req.user._id,
    course: courseId,
  });

  if (!course) throw new APIError(400, "course not found");

  return res
    .status(200)
    .json(new APIResponse(200, course, "course added successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
  const course = await Purchase.find({
    lerner: req.user._id,
  });

  return res
    .status(200)
    .json(new APIResponse(200, course, "course added successfully"));
});

export { addCourse, getCourses };
