import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  //get name and description from body
  //validate the name length and required and playlist description optional
  //get viodeo id from parmas and validate
  //create playlist
  //return playlist
  const { name, description } = req.body;
  const { videoId } = req.params;

  if (!name || !name?.trim() === "" || name.length < 3) {
    throw new ApiError(
      400,
      "Name is required and should be at least 3 characters long"
    );
  }
  if (description && description.length < 10) {
    throw new ApiError(
      400,
      "Description should be at least 10 characters long"
    );
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const checkPlaylistExists = await Playlist.findOne({ name });
  if (checkPlaylistExists) {
    throw new ApiError(400, "Playlist with this name already exists");
  }
  const createPlaylist = await Playlist.create({
    name: name.toLowerCase(),
    description,
    owner: req.user._id,
    videoIds: [videoId],
  });
  if (!createPlaylist) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, createPlaylist, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  //get user id form req.user
  //get query for pagination => page, limit
  //get sortby => bylatest or by name

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "User id is required");
  }

  const { page = 1, limit = 10, sortBy = 0 } = req.query;

  const pageNumber = Math.max(1, parseInt(page));
  const pageLimit = Math.max(1, Math.min(parseInt(limit), 20)); //max pageLimit is 20

  const sortCriteria = sortBy === 0 ? { createdAt: -1 } : { name: 1 };

  const aggregationPipeline = [
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $sort: sortCriteria },
    {
      $lookup: {
        from: "videos",
        localField: "videoIds",
        foreignField: "_id",
        pipeline: [{ $project: { "thumbnail.url": 1 } }],
        as: "videos",
      },
    },
    {
      $project: {
        name: 1,
        playlistThumbnail: { $first: "$videos.thumbnail.url" },
        playlistVideoCount: { $size: "$videoIds" },
      },
    },
  ];

  const aggregatePaginateOptions = {
    page: pageNumber,
    limit: pageLimit,
  };

  const playlistData = await Playlist.aggregatePaginate(
    aggregationPipeline,
    aggregatePaginateOptions
  );

  if (!playlistData || !playlistData.docs.length) {
    throw new ApiError(404, "No playlists found for the user.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlistData, "Playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  //get playlist id from params
  //validate playlist id
  //add pagination
  //get playlist
  //return playlist with videos and additional details
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = Math.max(1, parseInt(page));
  const pageLimit = Math.max(1, Math.min(parseInt(limit), 20)); //max pageLimit is 20

  const aggregationPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              userName: 1,
              avatar: "$avatar.url",
            },
          },
        ],
        as: "playlistOwner",
      },
    },
    {
      $unwind: "$playlistOwner",
    },
    {
      $lookup: {
        from: "videos",
        localField: "videoIds",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              title: 1,
              "thumbnail.url": 1,
              views: 1,
              owner: 1,
              createdAt: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                  },
                },
              ],
              as: "videoOwner",
            },
          },
          {
            $unwind: "$videoOwner",
          },
        ],
        as: "videos",
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        playlistThumbnail: { $first: "$videos.thumbnail.url" },
        playlistOwner: {
          userName: "$playlistOwner.userName",
          avatar: "$playlistOwner.avatar",
        },
        playlistTotalVideoCount: { $size: "$videoIds" },
        videos: {
          $map: {
            input: "$videos", //video array
            as: "video", // iterate over videos
            in: {
              _id: "$$video._id",
              title: "$$video.title",
              thumbnail: "$$video.thumbnail.url",
              owner: "$$video.owner.userName",
              views: "$$video.views",
              createdAt: "$$video.createdAt",
            },
          },
        },
      },
    },
  ];
  const aggregatePaginateOptions = {
    page: pageNumber,
    limit: pageLimit,
  };
  const playlistData = await Playlist.aggregatePaginate(
    aggregationPipeline,
    aggregatePaginateOptions
  );
  if (!playlistData || !playlistData.docs.length) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlistData, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // TODO: add video to playlist
  //get playlist id and video id from params
  //validate playlist id and video id
  //then check if video is already in playlist or not
  //if not then add video to playlist
  //return response
  const { playlistId, videoId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const updatePlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
      videoIds: { $ne: videoId },
    },
    {
      $addToSet: { videoIds: videoId },
    },
    {
      new: true,
    }
  );
  if (!updatePlaylist) {
    throw new ApiError(404, "Video already exists in playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePlaylist,
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  //get playlist id and video id from params
  //validate playlist id and video id
  //then check if video is already in playlist or not
  //if present then remove video from playlist
  //return response
  const { playlistId, videoId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const updatePlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
      videoIds: videoId,
    },
    {
      $pull: { videoIds: videoId }, //remove video id from videoIds array 
    },
    {
      new: true,
    }
  );
  if (!updatePlaylist) {
    throw new ApiError(404, "Video already exists in playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePlaylist,
        "Video added to playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  //get playlist id from params
  //validate playlist id
  //check if playlist owner is same as user
  //delete playlist
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, true, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  //get playlist id from params
  //validate playlist id
  //get playlist data from request body
  //update playlist
  //return response
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!name || !name?.trim() === "" || name.length < 3) {
    throw new ApiError(
      400,
      "Name is required and should be at least 3 characters long"
    );
  }

  if (description && description.length < 10) {
    throw new ApiError(
      400,
      "Description should be at least 10 characters long"
    );
  }
  const updatePlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $set: {
        name: name.toLowerCase(),
        description: description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatePlaylist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
