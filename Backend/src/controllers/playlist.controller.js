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
  

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
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
