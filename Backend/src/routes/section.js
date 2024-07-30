import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSection,
  getCourseSections,
  getSectionById,
  addVideoToSection,
  removeVideoFromSection,
  deleteSection,
} from "../controllers/section.js";

const router = Router();
router.use(verifyJWT);

router.route("/course/:courseId").get(getCourseSections);
router.route("/create/:courseId").post(createSection);
router.route("/add/:sectionId/:videoId").patch(addVideoToSection);
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromSection);
router.route("/:sectionId").get(getSectionById).delete(deleteSection);

export default router;
