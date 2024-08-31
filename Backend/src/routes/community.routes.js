import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweetContent,
  updateTweetMedia,
  getUserAllTweets,
} from "../controllers/community.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
// router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/createPost")
  .post(upload.single("media"), VerifyJwt, createTweet);
router.route("/user/:userId").get(VerifyJwt, getUserTweets);

router
  .route("/:postId")
  .patch(VerifyJwt, updateTweetContent)
  .delete(VerifyJwt, deleteTweet);

router
  .route("/updateMedia/:postId")
  .patch(upload.single("media"), VerifyJwt, updateTweetMedia);

router.get("/getUserAllTweets/:userId", getUserAllTweets);

export default router;
