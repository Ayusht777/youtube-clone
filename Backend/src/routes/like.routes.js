import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {VerifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/videoLikes/:videoId").post(toggleVideoLike);
router.route("/toggle/commentLikes/:commentId").post(toggleCommentLike);
router.route("/toggle/communityPostLikes/:communityId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router