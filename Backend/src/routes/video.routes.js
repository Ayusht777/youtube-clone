import { Router } from "express";
import { publishAVideo } from "../controllers/video.controller.js";
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

export default router;
