import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(VerifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-current-password").post(VerifyJwt, changeCurrentPassword);
router.route("/getCurrentUser").get(VerifyJwt, getCurrentUser);
router.route("/updateAccountDetails").patch(VerifyJwt, updateAccountDetails);
router
  .route("/updateUserAvatar")
  .patch(upload.single("avatar"), VerifyJwt, updateUserAvatar);
// router.route("/getUserChannelProfile").get(getUserChannelProfile);
router.route("/getUserChannelProfile/:userName").get(getUserChannelProfile);
router.route("/getUserWatchHistory").get(VerifyJwt, getUserWatchHistory);

export default router;
