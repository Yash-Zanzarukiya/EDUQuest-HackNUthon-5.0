import mongoose, { isValidObjectId } from "mongoose";
import { Section } from "../models/section.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { courseId } = req.params;


  if (!name || !isValidObjectId(courseId))
    throw new APIError(400, "All fields required");

  const playlist = await Section.create({
    name,
    course: courseId,
    owner: req.user._id,
  });

  if (!playlist) throw new APIError(500, "Error while creating Playlist");

  return res
    .status(200)
    .json(new APIResponse(200, playlist, "Playlist Created Successfully"));
});

const getCourseSections = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!isValidObjectId(courseId))
    throw new APIError(400, "Valid userId required");

  const sections = await Section.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "progresses",
              localField: "_id",
              foreignField: "_id",
              as: "isCompleted",
              pipeline: [
                {
                  $project: {
                    isCompleted: 1,
                  },
                },
              ],
            },
          }
        ],
      },
    },
    {
      $project: {
        name: 1,
        videos: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new APIResponse(200, sections, "sections sent successfully"));
});

const getSectionById = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  if (!isValidObjectId(sectionId)) {
    throw new APIError(400, "plese give valid section id");
  }
  const section = await Section.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(sectionId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: "progresses",
        //       localField: "_id",
        //       foreignField: "_id",
        //       as: "isCompleted",
        //       pipeline: [
        //         {
        //           $project: {
        //             isCompleted: 1,
        //           },
        //         },
        //       ],
        //     },
        //   },
        //   {
        //     $unwind: "$isCompleted",
        //   },
        // ],
      },
    },
    {
      $project: {
        name: 1,
        videos: 1,
        course: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new APIResponse(200, section, "Playlist sent successfully"));
});

const addVideoToSection = asyncHandler(async (req, res) => {
  const { sectionId, videoId } = req.params;

  if (!isValidObjectId(sectionId) || !isValidObjectId(videoId)) {
    throw new APIError(400, "Please give valid id");
  }

  const section = await Section.findByIdAndUpdate(
    sectionId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!section) throw new APIError(500, "Error while adding video to section");

  return res
    .status(200)
    .json(new APIResponse(200, section, "Video added to section successfully"));
});

const removeVideoFromSection = asyncHandler(async (req, res) => {
  const { sectionId, videoId } = req.params;
  if (!isValidObjectId(sectionId) || !isValidObjectId(videoId)) {
    throw new APIError(400, "plaese give valid video or playlist id");
  }

  const section = await Section.findByIdAndUpdate(
    sectionId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!section)
    throw new APIError(500, "Error while removing video from section");

  return res
    .status(200)
    .json(
      new APIResponse(200, section, "Video removed from section successfully")
    );
});

const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  if (!isValidObjectId(sectionId)) {
    throw new APIError(400, "Invalid PlaylistId");
  }
  const section = await Section.findByIdAndDelete(sectionId);

  if (!section) throw new APIError(500, "Error while deleting section");

  return res
    .status(200)
    .json(
      new APIResponse(200, { isDeleted: true }, "section deleted successfully")
    );
});

export {
  createSection,
  getCourseSections,
  getSectionById,
  addVideoToSection,
  removeVideoFromSection,
  deleteSection,
};
