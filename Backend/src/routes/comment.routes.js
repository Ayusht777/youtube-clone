import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  addCommentToPost,
  updateCommentToPost,
  deleteCommentToPost
} from "../controllers/comment.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment)

router.route("/:commentId").patch(updateComment).delete(deleteComment);


router.route("/commentOnPost/:postId").post(addCommentToPost);
router.route("/updateCommentOnPost").patch(updateCommentToPost);
router.route("/deleteCommentOnPost").delete(deleteCommentToPost);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
