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
    communityId: postId,
    content: comment,
  });
  if (existedComment) throw new ApiError(400, "comment already exist");
  const addCommentToPostDB = await Comment.create({
    communityId: postId,
    content: comment,
    owner: req.user._id,
  });
  if (!addCommentToPostDB) throw new ApiError(400, "comment not added");
  const commentDoc = await Comment.aggregate([
    { $match: { communityId: new mongoose.Types.ObjectId(postId) } },
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
        foreignField: "commentId",
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
    .json(new ApiResponse(200, commentDoc, "comment added successfully"));
});

const updateCommentToPost = asyncHandler(async (req, res) => {
  // TODO: update a comment
  //get comment id from params
  //get comment from body and req.user._id
  //validate comment id is in db or not and belongs to user or not
  //update comment in db
  const { commentId, communityId } = req.query;
  const { comment } = req.body;

  if (!commentId?.trim() || !communityId?.trim()) {
    throw new ApiError(400, "Invalid comment or community ID");
  }

  if (!comment?.trim() || comment.length < 10 || comment.length > 500) {
    throw new ApiError(400, "Comment must be between 10 and 500 characters");
  }

  const updateComment = await Comment.findByIdAndUpdate(
    {
      _id: commentId,
      owner: req.user._id,
      communityId: communityId
    },
    {
      content: comment,
    },
    { new: true, select: { _id: 1, content: 1, updatedAt: 1 } }
  ).lean()

  // console.log(updateComment instanceof mongoose.Document);
  //response  converting mongodb object to js object

  // console.log(updateComment);

  if (!updateComment) throw new ApiError(404, "comment not updated");
  return res
    .status(200)
    .json(new ApiResponse(200,updateComment,"comment updated successfully"));
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
