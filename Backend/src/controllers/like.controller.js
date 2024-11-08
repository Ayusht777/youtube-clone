import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Community } from "../models/community.model.js";

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
        new ApiResponse(
          200,
          { likeId: createLike?._id, state: true },
          "like added"
        )
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
  const comment = await Comment.findOne({ _id: commentId });

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
        new ApiResponse(
          200,
          { likeId: createLike?._id, state: true },
          "like added"
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likeId: null, state: false }, "like removed"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet / commuity post
  //check if community post  is valid
  //if yes then toggle like on community just create a like object and save it in db
  // for toggle like on commuity just delete a like object and save it in db
  const { communityId } = req.params;
  const user = req.user?._id;
  if (
    !communityId.trim() === "" ||
    !communityId ||
    !isValidObjectId(communityId)
  ) {
    throw new ApiError(406, "video id is required");
  }
  const community = await Community.findOne({ _id: communityId });
  if (!community) {
    throw new ApiError(404, "community Post not found");
  }
  const deletedLiked = await Like.findOneAndDelete({
    communityId: communityId,
    likeById: user,
  });
  if (!deletedLiked) {
    const createLike = await Like.create({
      communityId: communityId,
      likeById: user,
    });
    if (!createLike) {
      throw new ApiError(404, "like not created");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likeId: createLike?._id, state: true },
          "like added"
        )
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { likeId: null, state: false }, "like removed"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "user not found");
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const likedVideosAggeration = [
    { $match: { likeById: userId, videoId: { $exists: true } } },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: "videos",
        localField: "videoId",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    userName: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        _id: 0,
        videoId: "$video._id",
        videoTitle: "$video.title",
        videoThumbnail: "$video.thumbnail.url",
        videoOwner: "$video.owner.userName",
        videoViews: "$video.views",
        createdAt: "$video.createdAt",
      },
    },
  ];
  //syntax pipeline , options
  const likeVideoWithPagination = await Like.aggregatePaginate(
    Like.aggregate(likedVideosAggeration),
    {
      page,
      limit,
    }
  );

  console.log(likeVideoWithPagination);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likedVideos: likeVideoWithPagination.docs,
        pagination: {
          totalLikedVideos: likeVideoWithPagination.totalDocs,
          totalPages: likeVideoWithPagination.totalPages,
          currentPage: likeVideoWithPagination.page,
          pageSize: likeVideoWithPagination.limit,
        },
      },
      "liked videos fetched successfully"
    )
  );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
