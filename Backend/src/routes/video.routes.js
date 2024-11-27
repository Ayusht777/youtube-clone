import { Router } from "express";
import {
  publishAVideo,
  getVideoById,
  togglePublishStatus,
  updateVideo,
  updateVideoThumbnail,
  deleteVideo
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(VerifyJwt); // Applying middleware to all routes

router.route("/publishAVideo").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
  ]),
  publishAVideo
);

router.route("/:videoId").get(getVideoById);
router.route("/:videoId").delete(deleteVideo);
router.route("/updateVideoTitleAndDescription/:videoId").patch(updateVideo);
router
  .route("/updateVideoThumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateVideoThumbnail);
router.route("/toggleVideoPublishStatus/:videoId").patch(togglePublishStatus);
export default router;
