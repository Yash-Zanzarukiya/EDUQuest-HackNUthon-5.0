import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.js";
import { Topic } from "../models/topic.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadPhotoOnCloudinary,
  uploadVideoOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "", userId, all } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // if (isValidObjectId(userId)) filters.owner = userId;

  const pipeline = [];

  if (!all) {
    pipeline.push({
      $match: {
        isPublished: true,
      },
    });
  }

  if (query) {
    let words = query.trim();

    pipeline.push({
      $match: {
        title: {
          $regex: words,
          $options: "i",
        },
      },
    });
  }

  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
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
        videoFile: 1,
        title: 1,
        description: 1,
        duration: 1,
        thumbnail: 1,
        owner: 1,
        course: 1,
      },
    }
  );

  const allVideos = await Video.aggregate(pipeline);

  // console.log("allvideos: ",allVideos);

  Video.aggregatePaginate(allVideos, options, function (err, results) {
    if (!err) {
      const {
        docs,
        totalDocs,
        limit,
        page,
        totalPages,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = results;

      return res.status(200).json(
        new APIResponse(
          200,
          {
            videos: docs,
            totalDocs,
            limit,
            page,
            totalPages,
            pagingCounter,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
          },
          "Videos fetched successfully"
        )
      );
    } else throw new APIError(500, err.message);
  });
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, topics } = req.body;
  const { sectionId } = req.params;

  if (!title) {
    throw new APIError(400, "All fields is Required");
  }

  let videoFileLocalFilePath = "";
  if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
    videoFileLocalFilePath = req.files.videoFile[0].path;
  }
  if (!videoFileLocalFilePath) {
    throw new APIError(400, "Video File Must be Required");
  }

  let thumbnailLocalFilePath = null;
  if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnailLocalFilePath = req.files.thumbnail[0].path;
  }
  if (!thumbnailLocalFilePath) {
    throw new APIError(400, "Thumbnail File Must be Required");
  }

  // const { cldnry_res, summary } = await uploadVideoOnCloudinary(videoFileLocalFilePath);
  const cldnry_res = await uploadVideoOnCloudinary(videoFileLocalFilePath);

  if (!cldnry_res) {
    throw new APIError(500, "Error while Uploading Video File");
  }

  const thumbnailFile = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
  if (!thumbnailFile) {
    throw new APIError(500, "Error while uploadind thumbnail file");
  }

  const video = await Video.create({
    videoFile: cldnry_res.url,
    // summary,
    title,
    description: description || "",
    duration: cldnry_res.duration,
    thumbnail: thumbnailFile.url,
    section: sectionId || "",
    owner: req.user._id,
  });

  if (!video) {
    throw new APIError(500, "Error while Publishing Video");
  }

  let topicRes;
  if (topics) {
    topicRes = await Topic.create(
      topics.map((topic) => ({ name: topic.trim(), video: video._id }))
    );
  }

  if (!video) {
    throw new APIError(500, "Error while Publishing Video");
  }

  return res
    .status(200)
    .json(
      new APIResponse(200, { video, topicRes }, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new APIError(400, "Invalid video id");

  const video = await Video.findById(videoId);

  // const video = await Video.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(videoId),
  //       isPublished: true,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "owner",
  //       foreignField: "_id",
  //       as: "owner",
  //       pipeline: [
  //         {
  //           $project: {
  //             username: 1,
  //             fullName: 1,
  //             avatar: 1,
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $unwind: "$owner",
  //   },
  // ]);

  if (!video) throw new APIError(400, "No video found");

  return res
    .status(200)
    .json(new APIResponse(200, video, "Video sent successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) throw new APIError(400, "Invalid VideoId...");

  const thumbnailLocalFilePath = req.file?.path;
  if (!title && !description && !thumbnailLocalFilePath) {
    throw new APIError(400, "At-least one field required");
  }

  // check only owner can modify video
  const video = await Video.findById(videoId);
  if (!video) throw new APIError(404, "video not found");

  if (video.owner.toString() !== req.user._id.toString())
    throw new APIError(401, "Only owner can modify video details");

  //Update based on data sent
  let thumbnail;
  if (thumbnailLocalFilePath) {
    thumbnail = await uploadPhotoOnCloudinary(thumbnailLocalFilePath);
    if (!thumbnail)
      throw new APIError(500, "Error accured while uploading photo");
  }
  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnail) video.thumbnail = thumbnail.url;

  // Save in database
  const updatedVideo = await video.save({ validateBeforeSave: false });

  if (!updatedVideo) {
    throw new APIError(500, "Error while Updating Details");
  }

  return res
    .status(200)
    .json(new APIResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new APIError(400, "VideoId not found");

  const findRes = await Video.findByIdAndDelete(videoId);

  if (!findRes) throw new APIError(400, "Video not found");

  return res
    .status(200)
    .json(
      new APIResponse(200, { isDeleted: true }, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new APIError(400, "videoId required");

  const video = await Video.findById(videoId);
  if (!video) throw new APIError(400, "Video not found");

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save();

  if (!updatedVideo) throw new APIError(400, "Error while toggling");

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        { isPublished: updatedVideo.isPublished },
        "Video toggled successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
