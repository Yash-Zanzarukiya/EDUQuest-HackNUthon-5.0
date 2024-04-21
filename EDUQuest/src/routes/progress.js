import { Router } from "express";
import { toggleProgressStatus,createProgressStatus } from "../controllers/progress.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:courseId/:videoId").patch(toggleProgressStatus);
router.route("/:courseId/:videoId").post(createProgressStatus);

export default router;
