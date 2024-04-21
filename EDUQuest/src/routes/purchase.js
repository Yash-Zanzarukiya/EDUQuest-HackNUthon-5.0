import { Router } from "express";
import { addCourse, getCourses } from "../controllers/purchase.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(verifyJWT);

router.route("/:courseId").post(addCourse);
router.route("/").get(getCourses);

export default router;
