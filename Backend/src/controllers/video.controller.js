import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileCloudinary } from "../service/cloudinary.js";

const MIN_IMAGE_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MIN_VIDEO_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const allowedVideoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/3gpp",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",
  "video/x-flv",
  "video/avi",
  "video/x-ms-wmv",
];
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  //myTODO :
  // get video title,description,videoFile,thumbnail
  //validate the title ,description --->based on string
  //validate thumbnail on base of image
  //validate video on base of video

  //upload video and thumbnail on cloudniary
  //add the to sb with owner info
  //send response
  const { title, description } = req.body;

  if ((title.trim() || description.trim()) === "") {
    throw new ApiError(406, "title and description is required");
  }
  if (title.trim().length < 3) {
    throw new ApiError(411, "title should be at least 3 letters");
  }
  if (description.trim().length < 10) {
    throw new ApiError(411, "title should be at least of 3 letters");
  }

  const { videoFile, thumbnailFile } = req.files;

  const thumbnailFilePath = thumbnailFile[0]?.path;
  const videoFilePath = videoFile[0]?.path;

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(406, "thumbnail and video is required");
  }
  const { mimetype: thumbnailMimeType, size: thumbnailSize } = thumbnailFile[0];
  if (!allowedImageMimeTypes.includes(thumbnailMimeType)) {
    throw new ApiError(406, "thumbnail should be image");
  }
  if (
    thumbnailSize < MIN_IMAGE_FILE_SIZE ||
    thumbnailSize > MAX_IMAGE_FILE_SIZE
  ) {
    throw new ApiError(406, "thumbnail size should be between 20KB and 5MB");
  }
  const { mimetype: videoMimeType, size: videoSize } = videoFile[0];
  if (!allowedVideoMimeTypes.includes(videoMimeType)) {
    throw new ApiError(406, "video should be image");
  }
  if (videoSize < MIN_VIDEO_FILE_SIZE || videoSize > MAX_VIDEO_FILE_SIZE) {
    throw new ApiError(406, "video size should be between 20KB and 100MB");
  }
  const thumbnailResponse = await uploadFileCloudinary(thumbnailFilePath);
  if (!thumbnailResponse?.url || !thumbnailResponse?.publicId) {
    throw new ApiError(500, "thumbnail is not uplaoded on cloudinary");
  }

  const videoResponse = await uploadFileCloudinary(videoFilePath);
  if (!videoResponse?.url || !videoResponse?.publicId) {
    throw new ApiError(500, "video is not uplaoded on cloudinary");
  }
  const user = req?.user._id;

  const videoAddedToDB = await Video.create({
    videoFile: {
      url: videoResponse.url,
      publicId: videoResponse.publicId,
    },
    thumbnail: {
      url: thumbnailResponse.url,
      publicId: thumbnailResponse.publicId,
    },
    title,
    description,
    owner: user,
    isPublished: true,
    duration: videoResponse.duration,
  });

  if (!videoAddedToDB) {
    throw new ApiError(500, "video is not added to db");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, videoAddedToDB, "video is published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  //then check if video published or not
  //if published then return videourl , thumbnailurl, title, description

  const { videoId } = req.params;
  const userId = req.user._id;
  if (!videoId.trim() === "" || !isValidObjectId(videoId)) {
    throw new ApiError(406, "video id is required");
  }

  const isVideo = await Video.findOne({ _id: videoId, isPublished: true });

  if (!isVideo) {
    throw new ApiError(406, "video is not published");
  }
  if (!isVideo?.viewers?.includes(userId)) {
    const videoViewsUpdate = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
        },
      },
      { $addFields: { hasViewed: { $in: [userId, "$viewers"] } } },
      {
        $set: {
          viewers: {
            $cond: {
              if: { $eq: ["$hasViewed", false] }, // if hasViewed is false ->[false,false == true] then add the userId to viewers array else return the viewers array
              then: { $concatArrays: ["$viewers", [userId]] },
              else: "$viewers",
            },
          },
          views: {
            $cond: {
              if: { $eq: ["$hasViewed", false] },
              then: { $add: ["$views", 1] },
              else: "$views",
            },
          },
        },
      },
      {
        $merge: {
          into: "videos",
          whenMatched: "replace",
          whenNotMatched: "discard",
        },
      },
    ]);
  }

  const video = await Video.aggregate([
    //Stage 1 : Matching the VideoId in Video Collection
    {
      $match: { _id: new mongoose.Types.ObjectId(videoId), isPublished: true },
    },
    //Stage 2 : Finding the Owner of the Video
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          //Stage 1 : Finding the Subscribers of the Owner / Channel
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriberId",
              as: "subscribers",
            },
          },
        ],
      },
    },

    {
      $addFields: {
        isSubscribed: {
          $cond: {
            if: { in: [userId, "$subscribers.subscriberId"] },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        owner: {
          _id: 1,
          userName: 1,
          avatar: { $first: "$owner.avatar.url" },
          subsribers: { $size: "$owner.subscribers" },
        },
        isSubscribed: 1,
      },
    },

    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "commentByUsers",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerOfComment",
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "commentId",
              as: "likesByUsersOnComment",
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              content: 1,
              ownerOfComment: {
                _id: 1,
                userName: 1,
                avatar: { $first: "$ownerOfComment.avatar.url" },
              },
              likesCount: { $size: "$likesByUsersOnComment" },
            },
          },
        ],
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "videoId",
        as: "likesByUsersOnVideo",
        pipeline: [{ $project: { _id: 0, likeById: 1 } }],
      },
    },
    {
      $addFields: {
        likesCountOnVideo: {
          $size: "$likesByUsersOnVideo.likeById",
        },
        isVideoLikedByUser: {
          $cond: {
            if: { in: [userId, "$likesByUsersOnVideo.likeById"] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  return res.status(200).json(video);
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
