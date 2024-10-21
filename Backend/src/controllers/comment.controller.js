import mongoose, { connect } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Community } from "../models/community.model.js";
import { Like } from "../models/like.model.js";
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
});
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});
const addCommentToPost = asyncHandler(async (req, res) => {
  // TODO: get post id from params
  //get comment from body
  //validate post id is in db or not
  //add comment to post in db and also add user id and community id to it
  //add count to response
  const { postId } = req.params;
  const { comment } = req.body;
  if (!postId) throw new ApiError(400, "post id is required");
  if (!comment?.length > 10)
    throw new ApiError(
      400,
      "comment is required and must be at least of 10 letter"
    );
  const post = await Community.findById(postId);

  if (!post) throw new ApiError(404, "post not found");
  const existedComment = await Comment.findOne({
    post: postId,
    content: comment,
  });
  if (existedComment) throw new ApiError(400, "comment already exist");
  const addCommentToPostDB = await Comment.create({
    content: comment,
    post: postId,
    owner: req.user._id,
  });
  if (!addCommentToPostDB) throw new ApiError(400, "comment not added");
  const commentDoc = await Comment.aggregate([
    { $match: { post: new mongoose.Types.ObjectId(postId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "CommentBy",
        pipeline: [
          {
            $project: { _id: 0, userName: 1, fullName: 1, avatar: { url: 1 } },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "LikedBy",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$LikedBy" },
      },
    },
  ]);
  if (!commentDoc) throw new ApiError(404, "comment not found");
  return res
    .status(200)
    .json(200, new ApiResponse(commentDoc), "comment added successfully");
});

const updateCommentToPost = asyncHandler(async (req, res) => {
  // TODO: update a comment
  //get comment id from params
  //get comment from body and req.user._id
  //validate comment id is in db or not and belongs to user or not
  //update comment in db
  const { commentId } = req.params;
  const { comment } = req.body;
  console.log(commentId, comment);
  if (!commentId || !comment?.length)
    throw new ApiError(400, "comment id is required");
  const existingComments = await Comment.findOne({
    _id: commentId,
    content: comment,
  });

  if (existingComments)
    throw new ApiError(400, "comment already exist with same content");
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    { content: comment },
    { new: true }
  );

  if (!updateComment) throw new ApiError(404, "comment not updated");
  return res
    .status(200)
    .json(200, new ApiResponse(updateComment), "comment updated successfully");
});
const deleteCommentToPost = asyncHandler((req, res) => {
  // TODO: delete a comment on a post
  // get comment id from params
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  addCommentToPost,
  updateCommentToPost,
  deleteCommentToPost
};
