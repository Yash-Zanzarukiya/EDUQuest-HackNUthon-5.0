import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  createCourse,
  getCourseById,
  deleteCourse,
  togglePublishStatus,
  getAllCourses,
  getAllCoursesByOwner,
} from "../controllers/course.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCourses);
router.route("/:courseId").get(getCourseById).delete(deleteCourse);
router.route("/user/:userId").get(getAllCoursesByOwner);
router.route("/toggle/:courseId").patch(verifyJWT, togglePublishStatus);
router
  .route("/publish")
  .post(verifyJWT, upload.single("thumbnail"), createCourse);

export default router;
