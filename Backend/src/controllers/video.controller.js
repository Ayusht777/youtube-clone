import mongoose, { isValidObjectId } from 'mongoose';
import { Comment } from '../models/comment.model.js';
import { Like } from '../models/like.model.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import {
  deleteFileFromCloudinary,
  uploadFileCloudinary,
} from '../service/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MIN_IMAGE_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedImageMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/avif',
  'image/gif',
];
const MIN_VIDEO_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const allowedVideoMimeTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/3gpp',
  'video/x-msvideo',
  'video/quicktime',
  'video/x-matroska',
  'video/x-flv',
  'video/avi',
  'video/x-ms-wmv',
];
const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  //this is going to be used on homepage, search page, channel page, subscription page (maybe)
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const pageNumber = Math.max(1, parseInt(page));
  const pageLimit = Math.max(1, Math.min(parseInt(limit), 20)); //max pageLimit is 20
  const id = !userId && isValidObjectId(userId) && userId; //it can be channel id or user id

  const sortConfig = (sortBy) => {
    if (!sortBy ) {
      return { createdAt: -1 }; // Default sort by newest
    }
    switch (sortBy.toLowerCase()) {
      case 'views':
        return { views: -1 };
      case 'latest':
        return { createdAt: -1 };
      case 'oldest':
        return { createdAt: 1 };
      default:
        return { createdAt: -1 };
    }
  };

  const pipeline = [
    {
      $match: {
        isPublished: true,
        ...(query && { $text: { $search: { query } } }),
        ...(id && { owner: new mongoose.Types.ObjectId(id) }),
      },
    },
    {$sort: sortConfig(sortBy, sortType)},
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              userName: 1,
              'avatar.url': 1,
            },
          },
        ],
        as: 'channelDetails',
      },
    },
    {
      $unwind: '$channelDetails',
    },
    {
      $project: {
        thumbnail: '$thumbnail.url',
        title: 1,
        description: 1,
        views: 1,
        channelDetails: {
          _id: 1,
          userName: 1,
          avatar: '$channelDetails.avatar.url',
        },
      },
    },
  ];
  const aggregatePaginateOptions = {
    page: pageNumber,
    limit: pageLimit,
  };
  const aggregatePaginatePiplineResult = await Video.aggregatePaginate(
    pipeline,
    aggregatePaginateOptions
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        aggregatePaginatePiplineResult,
        'Videos Retrieved Successfully'
      )
    );
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

  if (!title?.trim() && !description?.trim()) {
    throw new ApiError(406, 'title and description are required');
  }
  if (title?.trim() && title.trim().length < 3) {
    throw new ApiError(411, 'title should be at least 3 characters');
  }
  if (description?.trim() && description.trim().length < 10) {
    throw new ApiError(411, 'description should be at least 10 characters');
  }

  const { videoFile, thumbnailFile } = req.files;

  const thumbnailFilePath = thumbnailFile[0]?.path;
  const videoFilePath = videoFile[0]?.path;

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(406, 'thumbnail and video is required');
  }
  const { mimetype: thumbnailMimeType, size: thumbnailSize } = thumbnailFile[0];
  if (!allowedImageMimeTypes.includes(thumbnailMimeType)) {
    throw new ApiError(406, 'thumbnail should be image');
  }
  if (
    thumbnailSize < MIN_IMAGE_FILE_SIZE ||
    thumbnailSize > MAX_IMAGE_FILE_SIZE
  ) {
    throw new ApiError(406, 'thumbnail size should be between 20KB and 5MB');
  }
  const { mimetype: videoMimeType, size: videoSize } = videoFile[0];
  if (!allowedVideoMimeTypes.includes(videoMimeType)) {
    throw new ApiError(406, 'video should be image');
  }
  if (videoSize < MIN_VIDEO_FILE_SIZE || videoSize > MAX_VIDEO_FILE_SIZE) {
    throw new ApiError(406, 'video size should be between 20KB and 100MB');
  }
  const thumbnailResponse = await uploadFileCloudinary(thumbnailFilePath);
  if (!thumbnailResponse?.url || !thumbnailResponse?.publicId) {
    throw new ApiError(500, 'thumbnail is not uplaoded on cloudinary');
  }

  const videoResponse = await uploadFileCloudinary(videoFilePath);
  if (!videoResponse?.url || !videoResponse?.publicId) {
    throw new ApiError(500, 'video is not uplaoded on cloudinary');
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
    throw new ApiError(500, 'video is not added to db');
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, videoAddedToDB, 'video is published successfully')
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  //then check if video published or not
  //if published then return videourl , thumbnailurl, title, description

  const { videoId } = req.params;
  const userId = req.user._id;
  if (!videoId.trim() === '' || !isValidObjectId(videoId)) {
    throw new ApiError(406, 'video id is required');
  }

  const isVideo = await Video.findOne({ _id: videoId, isPublished: true });

  if (!isVideo) {
    throw new ApiError(406, 'video is not published');
  }
  if (!isVideo.viewers.includes(userId)) {
    const videoViewsUpdate = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
        },
      },
      { $addFields: { hasViewed: { $in: [userId, '$viewers'] } } },
      {
        $set: {
          viewers: {
            $cond: {
              if: { $eq: ['$hasViewed', false] }, // if hasViewed is false ->[false,false == true] then add the userId to viewers array else return the viewers array
              then: { $concatArrays: ['$viewers', [userId]] },
              else: '$viewers',
            },
          },
          views: {
            $cond: {
              if: { $eq: ['$hasViewed', false] },
              then: { $add: ['$views', 1] },
              else: '$views',
            },
          },
        },
      },
      { $unset: 'hasViewed' },
      {
        $merge: {
          into: 'videos',
          whenMatched: 'replace',
          whenNotMatched: 'discard',
        },
      },
    ]);
  }

  const updateWatchHistory = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $addFields: {
        hasInWatchHistory: {
          $in: [new mongoose.Types.ObjectId(videoId), '$watchHistory.videoId'],
        },
      },
    },
    {
      $set: {
        watchHistory: {
          $cond: {
            if: { $eq: ['$hasInWatchHistory', false] },
            then: {
              $concatArrays: [
                '$watchHistory',
                [
                  {
                    videoId: new mongoose.Types.ObjectId(videoId),
                    lastWatchedAt: new Date(),
                  },
                ],
              ],
            },
            else: '$watchHistory', // Ensure that the else case keeps the existing watch history
          },
        },
      },
    },
    {
      $unset: 'hasInWatchHistory',
    },
    {
      $merge: {
        into: 'users',
        whenMatched: 'replace',
        whenNotMatched: 'discard',
      },
    },
  ]);

  const video = await Video.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(videoId), isPublished: true },
    },
    {
      $project: {
        videoFile: '$videoFile.url',
        thumbnail: '$thumbnail.url',
        title: 1,
        description: 1,
        views: 1,
        owner: 1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'channelOwner',
        pipeline: [{ $project: { userName: 1, avatar: '$avatar.url' } }],
      },
    },
    { $unwind: '$channelOwner' },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'owner',
        foreignField: 'channelId',
        as: 'subscribers',
        pipeline: [{ $project: { subscriberId: 1 } }],
      },
    },
    {
      $addFields: {
        isSubscribed: { $in: [userId, '$subscribers.subscriberId'] },
        subscribers: { $size: '$subscribers' },
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'videoId',
        as: 'likesOnVideo',
        pipeline: [{ $project: { likeById: 1, _id: 0 } }],
      },
    },
    {
      $addFields: {
        likesCountOnVideo: { $size: '$likesOnVideo.likeById' },
        isVideoLikedByUser: { $in: [userId, '$likesOnVideo.likeById'] },
      },
    },
    { $unset: 'likesOnVideo' },
  ]);
  if (!video.length) {
    throw new ApiError(500, 'Unable to Retrieve Video');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], 'Video Retrieved Successfully'));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description
  //get video id from params and validate it
  //get title and description from body and validate them
  //update video details
  const { videoId } = req.params;
  const { title, description } = req.body;
  const user = req.user?._id;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(406, 'video id is required');
  }
  if (!title?.trim() && !description?.trim()) {
    throw new ApiError(406, 'title and description are required');
  }
  if (title?.trim() && title.trim().length < 3) {
    throw new ApiError(411, 'title should be at least 3 characters');
  }
  if (description?.trim() && description.trim().length < 10) {
    throw new ApiError(411, 'description should be at least 10 characters');
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    { _id: videoId, owner: user },
    { $set: { title, description } },
    { new: true, projection: { title: 1, description: 1, updatedAt: 1 } }
  );
  if (!updatedVideo) {
    throw new ApiError(404, 'video not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, 'Video updated successfully'));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  //TODO : update video thumbnail
  //get video id from params
  //validate video id
  //get thumbnail from body
  //validate thumbnail
  //update video thumbnail
  //send response
  const { videoId } = req.params;
  const { mimetype, size, path } = req.file;

  const user = req.user?._id;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(404, 'Not A Validate Video Id');
  }
  if (!path) {
    throw new ApiError(406, 'thumbnail is required');
  }

  if (size > MAX_IMAGE_FILE_SIZE || size < MIN_IMAGE_FILE_SIZE) {
    throw new ApiError(406, 'thumbnail size should be between 10KB and 10MB');
  }
  if (!allowedImageMimeTypes.includes(mimetype)) {
    throw new ApiError(406, 'thumbnail should be in jpg, jpeg, png format');
  }
  const video = await Video.findOne({ _id: videoId });
  if (!video) {
    throw new ApiError(404, 'video not found');
  }

  const updateThumbnailUrl = await uploadFileCloudinary(path);
  if (!updateThumbnailUrl) {
    throw new ApiError(500, 'Unable to upload new thumbnail on cloudinary');
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    { _id: videoId, owner: user },
    {
      $set: {
        thumbnail: {
          url: updateThumbnailUrl.url,
          publicId: updateThumbnailUrl.publicId,
        },
      },
    },
    { new: true, projection: { thumbnail: 1, updatedAt: 1 } }
  );
  if (!updatedVideo) {
    throw new ApiError(404, 'video not found');
  }
  const deleteThumbnailUrl = await deleteFileFromCloudinary(
    video.thumbnail.publicId
  );
  if (!deleteThumbnailUrl) {
    throw new ApiError(500, 'Unable to delete old thumbnail from cloudinary');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, 'Video updated successfully'));
});
const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  //get video id from params
  //validate video id
  //then check owner of video and video present or not
  //if present then delete video and thumbnail from cloudinary and database
  //send response
  const { videoId } = req.params;
  const user = req.user?._id;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(406, 'video id is required');
  }
  const video = await Video.findOne({ _id: videoId });
  if (!video) {
    throw new ApiError(404, 'video not found');
  }

  const deleteVideoOnCloudinary = await deleteFileFromCloudinary(
    video.videoFile.publicId
  );
  if (!deleteVideoOnCloudinary) {
    throw new ApiError(500, 'Unable to delete video from cloudinary');
  }
  const deleteThumbnailOnCloudinary = await deleteFileFromCloudinary(
    video.thumbnail.publicId
  );
  if (!deleteThumbnailOnCloudinary) {
    throw new ApiError(500, 'Unable to delete thumbnail from cloudinary');
  }
  const documentNames = ['Likes', 'Comments', 'Video'];

  const deleteVideoAndRealtedDocuments = await Promise.allSettled([
    Like.deleteMany({ videoId: videoId }),
    Comment.deleteMany({ video: videoId }),
    Video.deleteOne({ _id: videoId }),
  ]);

  deleteVideoAndRealtedDocuments.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      throw new ApiError(
        500,
        `Failed to delete ${documentNames[index]}: ${result.reason?.message || 'Unknown error'}`
      );
    }
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deleteVideo: { videoId, status: true } },
        'Video deleted successfully'
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  //TODO: toggle publish status of video
  //get video id from params
  //validate video id
  //if already published then unpublish vice versa

  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(406, 'video id is required');
  }
  const user = req.user._id;
  const toggleVideoStatus = await Video.findByIdAndUpdate(
    { _id: videoId, owner: user },
    [{ $set: { isPublished: { $not: '$isPublished' } } }],
    { new: true }
  );

  if (!toggleVideoStatus) {
    throw new ApiError(404, 'Video Not Found');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: toggleVideoStatus?.isPublished },
        'Video Published Status Updated'
      )
    );
});

export {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  updateVideoThumbnail,
};
