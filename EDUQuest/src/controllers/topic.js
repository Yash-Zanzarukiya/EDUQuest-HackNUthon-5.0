import { Topic } from "../models/topic.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/APIResponse.js";

const getAllTopicVideos = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const videos = await Topic.find({
    _id: new mongoose.Types.ObjectId(topicId),
  });

  return res
    .status(200)
    .json(new APIResponse(200, videos, "videos added successfully"));
});

const getAllTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  return res
    .status(200)
    .json(new APIResponse(200, topics, "videos added successfully"));
});

export { getAllTopics, getAllTopicVideos };
