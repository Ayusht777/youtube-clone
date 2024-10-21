import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  addCommentToPost,
  updateCommentToPost,
} from "../controllers/comment.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/commentOnPost/:postId").post(addCommentToPost);
router.route("/commentOnPost/:commentId").patch(updateCommentToPost);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
