import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  createCourse,
  getCourseById,
  deleteCourse,
  togglePublishStatus,
  getAllCourses,
} from "../controllers/course.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/publish")
  .post(verifyJWT, upload.single("thumbnail"), createCourse);

router.route("/toggle/:courseId").patch(verifyJWT, togglePublishStatus);
router.route("/:courseId").get(getCourseById);
router.route("/:courseId").delete(deleteCourse);
router.route("/").get(getAllCourses);

export default router;
