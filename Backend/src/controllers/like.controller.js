import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  //check if videoId is valid and video exists
  //if yes then toggle like on video just create a like object and save it in db
  // for toggle like on video just delete a like object and save it in db

  const { videoId } = req.params;
  const user = req.user?._id;
  if (!videoId.trim() === "" || !videoId || !isValidObjectId(videoId)) {
    throw new ApiError(406, "video id is required");
  }
  const video = await Video.findOne({ _id: videoId, isPublished: true });

  if (!video) {
    throw new ApiError(404, "video not found or is not published");
  }

  const deletedLiked = await Like.findOneAndDelete({
    videoId: videoId,
    likeById: user,
  });
  
  if (!deletedLiked) {
    const createLike = await Like.create({
      videoId: videoId,
      likeById: user,
    });

    if (!createLike) {
      throw new ApiError(404, "like not created");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { likeId: createLike?._id, state: true }, "like added")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likeId: null, state: false }, "like removed"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
  //check if commentId is valid and comment exists
  //if yes then toggle like on comment just create a like object and save it in db
  // for toggle like on comment just delete a like object and save it in db
  const { commentId } = req.params;


  const user = req.user?._id;
  if (!commentId.trim() === "" || !commentId || !isValidObjectId(commentId)) {
    throw new ApiError(406, "video id is required");
  }
  const comment = await Comment.findOne({ _id: commentId});

  if (!comment) {
    throw new ApiError(404, "video not found or is not published");
  }

  const deletedLiked = await Like.findOneAndDelete({
    commentId: commentId,
    likeById: user,
  });
  
  if (!deletedLiked) {
    const createLike = await Like.create({
      commentId: commentId,
      likeById: user,
    });

    if (!createLike) {
      throw new ApiError(404, "like not created");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { likeId: createLike?._id, state: true }, "like added")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likeId: null, state: false }, "like removed"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
