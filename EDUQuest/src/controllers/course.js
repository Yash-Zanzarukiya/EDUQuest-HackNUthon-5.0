import mongoose, { isValidObjectId } from "mongoose";
import { Course } from "../models/course.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadPhotoOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    throw new APIError(400, "All fields required");

  const photoLocalPath = req.file?.path;

  if (!photoLocalPath) {
    throw new APIError(400, "All fields required");
  }
  let photo = await uploadPhotoOnCloudinary(photoLocalPath);

  if (!photo) throw new APIError(500, "Error Accured While uploading File");

  const course = await Course.create({
    name,
    description,
    thumbnail: photo.url,
    price,
    owner: req.user._id,
  });

  if (!course) throw new APIError(500, "Error while creating Playlist");

  return res
    .status(200)
    .json(new APIResponse(200, course, "Playlist Created Successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!isValidObjectId(courseId))
    throw new APIError(400, "Valid userId required");

  const course = await Course.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    // {
    //   $lookup: {
    //     from: "sections",
    //     localField: "sections",
    //     foreignField: "_id",
    //     as: "sections",
    //     // pipeline: [
    //     //   {
    //     //     $lookup: {
    //     //       from: "videos",
    //     //       localField: "videos",
    //     //       foreignField: "_id",
    //     //       as: "videos"
    //     //     },
    //     //   }
    //     // ],
    //   },
    // },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        name: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        isPublished: 1,
        owner: 1,
        sections: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new APIResponse(200, course, "sections sent successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const course = await Course.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        name: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        isPublished: 1,
        owner: 1,
        sections: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new APIResponse(200, course, "sections sent successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!isValidObjectId(courseId)) {
    throw new APIError(400, "Invalid PlaylistId");
  }
  const section = await Course.findByIdAndDelete(courseId);

  if (!section) throw new APIError(500, "Error while deleting section");

  return res
    .status(200)
    .json(
      new APIResponse(200, { isDeleted: true }, "section deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) throw new APIError(400, "videoId required");

  const course = await Course.findById(courseId);
  if (!course) throw new APIError(400, "Video not found");

  course.isPublished = !course.isPublished;
  const updatedCourse = await course.save();

  if (!updatedCourse) throw new APIError(400, "Error while toggling");

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { isPublished: updatedCourse.isPublished },
        "Video toggled successfully"
      )
    );
});

export {
  createCourse,
  getCourseById,
  deleteCourse,
  togglePublishStatus,
  getAllCourses,
};
