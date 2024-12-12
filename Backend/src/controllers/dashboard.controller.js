import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total comments , total likes etc.
  // get user id from req.user
  //get all videos uploaded by that user to get all views , likes , comments etc

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const getChannelStats = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $project: { _id: 1 },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        pipeline: [{ $project: { views: 1, isPublished: 1 } }],
        as: "videos",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "videos._id",
        foreignField: "video",
        pipeline: [{ $project: { _id: 1 } }],
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "videos._id",
        foreignField: "videoId",
        pipeline: [{ $project: { _id: 1 } }],
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channelId",
        pipeline: [
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "subscibers",
      },
    },
    {
      $project: {
        _id: 1,
        totalViews: { $sum: "$videos.views" },
        totalComments: { $size: "$comments" },
        totalLikes: { $size: "$likes" },
        totalVideos: { $size: "$videos" },
        totalSubscribers: { $size: "$subscibers" },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, getChannelStats, "Channel Stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  // get user id then get all videos uploaded by that user
  //get info like title, description, views, likes,comments, thumbnail, publishedAt,
  const userId = req.user.id;
  const { page = 1, limit = 10, query } = req.query;
  const pageNumber = Math.max(1, parseInt(page));
  const pageLimit = Math.max(1, Math.min(parseInt(limit), 20)); //max pageLimit is 20
  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const getChannelVideosPipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        ...(query && {
          $text: {
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false,
          }, // IT WILL WORK "Cafe Tutorial" "CAFÉ TUTORIA" "Cafè Tutorial""cafe TUTORIAL"
        }),
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "videoId",
        pipeline: [
          {
            $project: { _id: 1 },
          },
        ],
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        pipeline: [
          {
            $project: { _id: 1 },
          },
        ],
        as: "comments",
      },
    },
    {
      $project: {
        ...(query && { score: { $meta: "textScore" } }),
        thumbnail: "$thumbnail.url",
        title: 1,
        description: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        likes: {
          $size: "$likes",
        },
        comments: {
          $size: "$comments",
        },
      },
    },
  ];
  
  const aggregatePaginateOptions = {
    page: pageNumber,
    limit: pageLimit,
  };

  const channelVideos = await Video.aggregatePaginate(
    Video.aggregate(getChannelVideosPipeline),
    aggregatePaginateOptions
  );

  if (!channelVideos) {
    throw new ApiError(400, "Channel videos not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelVideos, "Channel videos fetched successfully")
    );
});

export { getChannelStats, getChannelVideos };

