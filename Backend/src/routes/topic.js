import { Router } from "express";
import { getAllTopics, getAllTopicVideos } from "../controllers/topic.js";

const router = Router();

router.route("/").get(getAllTopics);

router.route("/:topicId").get(getAllTopicVideos);

export default router;
