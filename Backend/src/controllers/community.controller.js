import mongoose from "mongoose";
import { Community } from "../models/community.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadFileCloudinary,
  deleteFileFromCloudinary,
} from "../service/cloudinary.js";

const MIN_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
];
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  //get content valid it for length etc
  //get media image only at a time
  //get owner
  //set to this db
  //now set user details like , comment in tweet using aggregation pipeline
  //return response

  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(401, "content is required");
  }
  if (content?.length < 10) {
    throw new ApiError(401, "content length should be at least 10");
  }

  const file = req.file;
  if (!req.file) {
    throw new ApiError(401, "media is required");
  }
  const { mimetype, path, size } = file;

  if (!allowedMimeTypes.includes(mimetype)) {
    throw new ApiError(401, "media type not supported");
  }
  if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
    throw new ApiError(401, "media size should be between 20kb and 5mb");
  }
  const user = req?.user?._id;

  const checkCommunityPostExists = await Community.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user), //check based on user id
        content: content,
      },
    },
  ]);

  if (checkCommunityPostExists?.length) {
    throw new ApiError(401, "post already exists");
  }
  const mediaResponse = await uploadFileCloudinary(path);

  const Post = await Community.create({
    owner: user,
    content,
    media: {
      url: mediaResponse.url,
      publicId: mediaResponse.publicId,
    },
  });

  if (!Post) {
    const deleteMedia = await deleteFileFromCloudinary(mediaResponse.publicId);
    if (!deleteMedia) {
      throw new ApiError(
        401,
        "Community post is not created and media is not deleted"
      );
    }
    throw new ApiError(
      401,
      "Community post is not created and media is  deleted"
    );
  }
  const populatePostWithInfo = await Community.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(Post._id) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "postCreatedBy",
        pipeline: [
          {
            $project: {
              _id: 0,
              fullName: 1,
              userName: 1,
              avatar: { url: 1 },
            },
          },
        ],
      },
    },

    {
      $unwind: {
        //you can also use $ addFields
        path: "$postCreatedBy",
      },
    },
  ]);
  if (!populatePostWithInfo?.length) {
    throw new ApiError(
      412,
      "Community post is not populated with post information"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Community post created successfully",
        populatePostWithInfo[0]
      )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  //get user id from params
  //check id is valid
  const userId = req.user?._id;
  console.log(req.user?._id);

  if (!userId) {
    throw new ApiError(401, "user id not found in params");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  const posts = await Community.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner", //filed of community
        foreignField: "_id",
        as: "postCreatedBy",
        pipeline: [
          {
            $project: {
              _id: 0,
              userName: 1,
              fullName: 1,
              avatar: { url: 1 },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "communityId",
        as: "likedByUser",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "communityId",
        as: "commentByUser"

      },
    },
    {
      $addFields: {
        likeByUser: {
          $size: "$likedByUser",
        },
        isLikeByUser: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(userId), "$likedByUser.likeById"],
            },
            then: true,
            else: false,
          },
        },
        recentComment: {
          $slice: ["$commentByUser", -1], //it will get only one comment which one is recent one}
        },
        postCreatedBy: {
          $first: "$postCreatedBy",
        },
      },
    },
  ]);
  console.log(posts);
  if (!posts?.length > 0) {
    throw new ApiError(401, "posts not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "all post successfully fetched"));
});

const updateTweetContent = asyncHandler(async (req, res) => {
  //TODO: update tweet
  //get post id from params
  //get content from body
  //check if post exists and if post belongs to user
  //if yes then update post
  //if no then return error

  const { postId } = req.params;
  const { content } = req.body;
  const user = req.user._id;
  console.log(postId, content, user);
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  if (!postId || !content?.trim() || content.length < 10) {
    throw new ApiError(401, "post id is required and content is required");
  }

  if (!post) {
    throw new ApiError(401, "post not found");
  }

  const updatedPost = await Community.findOneAndUpdate(
    { _id: postId, owner: user },
    { $set: { content: content } },
    { new: true }
  );
  console.log(post);
  if (!updatedPost) {
    throw new ApiError(401, "post not updated");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Community post updated successfully", updatedPost)
    );
});
const updateTweetMedia = asyncHandler(async (req, res) => {
  //Todo :update Tweet Media
  //get post id from params
  //get media from body validation
  //uplaad media to cloudinary
  //check if post exists and if post belongs to user if yes then update post and replace it wit new media
  //if no then delete media from cloudinary amd return error

  const { postId } = req.params;
  const media = req.file;
  const user = req.user._id;
  console.log(postId, media, user);
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  if (!postId || !media) {
    throw new ApiError(401, "post id and media required");
  }
  const { path, mimetype, size } = media;
  if (!path || !mimetype || !size) {
    throw new ApiError(401, "media properties required");
  }
  if (!allowedMimeTypes.includes(mimetype)) {
    throw new ApiError(401, "media type not supported");
  }
  if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
    throw new ApiError(401, "media size should be between 20kb and 5mb");
  }
  const mediaResponse = await uploadFileCloudinary(path);
  if (!mediaResponse || !mediaResponse.url || !mediaResponse.publicId) {
    throw new ApiError(401, "media not uploaded");
  }
  const existedPost = await Community.findOne({ _id: postId, owner: user });
  if (!existedPost) {
    throw new ApiError(401, "post not found");
  }
  const deleteOldExistedMedia = await deleteFileFromCloudinary(
    existedPost.media.publicId
  );
  if (!deleteOldExistedMedia) {
    throw new ApiError(
      401,
      "media not deleted on cloudinary while updating media on db"
    );
  }
  const updatePost = await Community.findOneAndUpdate(
    { _id: postId, owner: user },
    { $set: { media: mediaResponse } },
    { new: true }
  );
  if (!updatePost) {
    const deleteMedia = await deleteFileFromCloudinary(mediaResponse.publicId);
    if (!deleteMedia) {
      throw new ApiError(
        401,
        "media not deleted on cloudinary while updating media on db"
      );
    }
    throw new ApiError(401, "post not updated");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Community post updated successfully", updatePost)
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  //get post id from params
  //check if post exists and if post belongs to user
  //delete the post image on cloudinary
  //delete the post from db
  //if no then return error
  const { postId } = req.params;
  const user = req.user._id;
  if (!postId || !user) {
    throw new ApiError(401, "post id and user id required");
  }
  const post = await Community.findOne({ _id: postId, owner: user });
  if (!post) {
    throw new ApiError(401, "post not found");
  }
  const deletePostMediaOncloudinary = await deleteFileFromCloudinary(
    post.media.publicId
  );
  if (!deletePostMediaOncloudinary) {
    throw new ApiError(401, "post media not deleted on cloudinary");
  }
  const deletePostLike = await Like.deleteMany({
    communityId: new mongoose.Types.ObjectId(postId),
  });
  console.log(deletePostLike);
  if (!deletePostLike) {
    throw new ApiError(401, "post like not deleted");
  }
  const deletePostComment = await Comment.deleteMany({
    communityId: new mongoose.Types.ObjectId(postId),
  });
  if (!deletePostComment) {
    throw new ApiError(401, "post comment not deleted");
  }
  const deletePost = await Community.findOneAndDelete({
    _id: postId,
    owner: user,
  });
  if (!deletePost) {
    throw new ApiError(401, "post not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "post deleted successfully"));
});

const getUserAllTweets = asyncHandler(async (req, res) => {
  //TODO: get  user id validate in params
  //get page and limit from query params
  //get all posts of current user from db with pagination
  const LIMIT_PAGE_SIZE = 10;
  const DEFAULT_PAGE = 1; //i means a collection of 10 documents
  const { userId } = req.params;
  console.log(req.params);
  const page = parseInt(req.query.page) || DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || LIMIT_PAGE_SIZE;
  if (!userId) {
    throw new ApiError(401, "user id not found in params");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const skip = (page - 1) * limit; //it will give us the number of documents to skip

  const posts = await Community.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner", //filed of community
        foreignField: "_id",
        as: "postCreatedBy",
        pipeline: [
          {
            $project: {
              _id: 0,
              userName: 1,
              fullName: 1,
              avatar: { url: 1 },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "communityId",
        as: "likedByUser",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "communityId",
        as: "commentByUser",
      },
    },
    {
      $addFields: {
        likeByUser: {
          $size: "$likedByUser",
        },
        isLikeByUser: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(userId), "$likedByUser.likeById"],
            },
            then: true,
            else: false,
          },
        },
        recentComment: {
          $slice: ["$commentByUser", -1], //it will get only one comment which one is recent one}
        },
        postCreatedBy: {
          $first: "$postCreatedBy",
        },
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);
  console.log(posts);
  if (!posts?.length > 0) {
    throw new ApiError(401, "posts not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "all post successfully fetched"));
});

export {
  createTweet,
  getUserTweets,
  updateTweetContent,
  updateTweetMedia,
  deleteTweet,
  getUserAllTweets,
};
