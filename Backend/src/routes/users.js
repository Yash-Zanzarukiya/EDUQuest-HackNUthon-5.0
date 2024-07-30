import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  getUserProfile,
} from "../controllers/users.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/u/:username").get(verifyJWT, getUserProfile);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

export default router;
