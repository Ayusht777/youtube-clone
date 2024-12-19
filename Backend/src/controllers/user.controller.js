import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadFileCloudinary,
  deleteFileFromCloudinary,
} from "../service/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

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

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); // user object from model
    if (!user) {
      throw new ApiError(
        500,
        "Something went wrong while generating Refresh & Access Token due to user not found"
      );
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false }); //off auto validation
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh & Access Token"
    );
  }
};

const optionsForAccessTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 1000, // 60 minutes
};
const optionsForRefreshTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  // validation on backend site {not empty}
  // check if user already exit check {email,username}
  // check for images ,check for avatar
  // check for multer image added then check for cloudaniry
  // create user object in db
  // send response to frontend site (remove password and refresh token)
  // check user creation
  // return  response
  const { email, password, userName, fullName } = req.body;
  console.log(req.body);
  console.log(req.files);
  if (
    [email, password, userName, fullName].some(
      (inputFields) => inputFields?.trim() === "" //trim used to remove space
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (userName?.length < 3) {
    throw new ApiError(422, "Username must be at least 3 characters");
  }

  if (fullName?.length < 3) {
    throw new ApiError(422, "Full name must be at least 3 characters");
  }

  if (!RegExp(emailRegex).test(email)) {
    throw new ApiError(422, "Invalid email address");
  }

  if (password.length < 6) {
    throw new ApiError(
      422,
      "Password must be at least 6 characters"
    ); /*Error Code 422 (Unprocessable Entity):
    Both checks for password length and complexity use this code.
    It indicates that the password does not meet the required length or complexity,
     which are both issues with the provided data's validity.*/
  } else if (!RegExp(passwordRegex).test(password)) {
    throw new ApiError(
      400,
      "Password must contains a Capital letter,spacial symbol and number"
    );
  }

  const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatar = req.files?.avatar?.[0]?.path;
  // console.log(avatar);
  const coverImage = req.files?.coverImage?.[0]?.path;

  if (!avatar) {
    throw new ApiError(400, "Avatar is required"); // 400 Bad Request: No file uploaded
  }

  const { mimetype, size } = req.files?.avatar?.[0];
  console.log(mimetype, size);
  // Validate file type
  if (!allowedMimeTypes.includes(mimetype)) {
    throw new ApiError(
      415,
      "Unsupported file type. Allowed formats are: JPEG, PNG, JPG, WebP, AVIF, GIF"
    ); // 415 Unsupported Media Type
  }

  // Validate file size
  if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
    throw new ApiError(
      413,
      `File size must be between ${MIN_FILE_SIZE / 1024} KB and ${
        MAX_FILE_SIZE / 1024 / 1024
      } MB` // 413 Payload Too Large
    );
  }

  if (coverImage) {
    const { mimetype, size } = req.files?.coverImage?.[0];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new ApiError(
        415,
        "Unsupported file type. Allowed formats are: JPEG, PNG, JPG, WebP, AVIF, GIF"
      ); // 415 Unsupported Media Type
    }

    // Validate file size
    if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
      throw new ApiError(
        413,
        `File size must be between ${MIN_FILE_SIZE / 1024} KB and ${
          MAX_FILE_SIZE / 1024 / 1024
        } MB` // 413 Payload Too Large
      );
    }
  }

  const avatarUploadResponse = await uploadFileCloudinary(avatar);
  console.log(avatarUploadResponse.url);
  if (!avatarUploadResponse.url || !avatarUploadResponse.publicId) {
    throw new ApiError(500, "Failed to upload avatar. Please try again.");
  }
  let CoverImageUploadResponse = "";
  if (coverImage) {
    CoverImageUploadResponse = await uploadFileCloudinary(coverImage);
    if (!CoverImageUploadResponse.url || !CoverImageUploadResponse.publicId) {
      throw new ApiError(
        500,
        "Failed to upload cover image. Please try again."
      );
    }
  }

  const user = await User.create({
    userName: userName?.toLowerCase(),
    email,
    fullName,
    avatar: {
      url: avatarUploadResponse.url,
      publicId: avatarUploadResponse.publicId,
    },

    coverImage: CoverImageUploadResponse?.url || "",
    password,
  });

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory -__v"
  ); //remove password & refresh token

  if (!newUser) {
    throw new ApiError(500, "Failed to create user. Please try again.");
  }

  return res.status(201).json(new ApiResponse(201, newUser, "User created"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get data fields like username , mail , password
  //validate all fields
  //check user existed in db or not
  //generate  access token and refresh token
  //send cookie secure
  // send response

  // if (req.cookies.accessToken || req.cookies.refreshToken) {
  //   throw new ApiError(400, "User is already logged in.");
  // }
  const { userName, email, password } = req.body;
  // console.log(userName, email, password);

  if (!userName && !email) {
    throw new ApiError(422, "username & email is required");
  }
  if (!password) {
    throw new ApiError(422, "Password is required");
  }

  if (userName?.length < 3) {
    throw new ApiError(411, "username should be at least of 3 letters");
  }
  if (!RegExp(emailRegex).test(email)) {
    throw new ApiError(406, "enter a valid email");
  }
  if (password?.length < 6) {
    throw new ApiError(411, "password should be at least of 6 letters");
  } else if (!RegExp(passwordRegex).test(password)) {
    throw new ApiError(
      406,
      "Password must contains a Capital letter,spacial symbol and numbe"
    );
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) throw new ApiError(401, "User does not exist !!");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid User Password"); //refer user model for isPasswordCorrect Checked is not inverse

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory -__v"
  );

const responseData = {
  accessToken,
  refreshToken,
  _id: loggedInUser._id,
  username: loggedInUser.userName,
  fullname: loggedInUser.fullName,
  email: loggedInUser.email,
  avatar: loggedInUser.avatar,
  coverImage: loggedInUser.coverImage,
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, optionsForAccessTokenCookie)
    .cookie("refreshToken", refreshToken, optionsForRefreshTokenCookie)
    .json(new ApiResponse(200, responseData, "User Logged In Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "User is not logged in or session has expired");
  }
  if (user && user.refreshToken) {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        // $set: { refreshToken: undefined },
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );
  } else {
    throw new ApiError(401, "Unauthorized request for LOGOUT");
  }

  return res
    .status(200)
    .clearCookie("accessToken", optionsForAccessTokenCookie)
    .clearCookie("refreshToken", optionsForRefreshTokenCookie)
    .json(new ApiResponse(200, {}, "User Logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const receivedRefreshedToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!receivedRefreshedToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedRefreshToken = await jwt.verify(
      receivedRefreshedToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedRefreshToken) {
      throw new ApiError(401, "Refresh token is not decoded");
    }
    const user = await User.findById(decodedRefreshToken?._id); //refer user model for this

    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }
    if (receivedRefreshedToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const { generatedAccessToken, generatedRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", generatedAccessToken, optionsForAccessTokenCookie)
      .cookie(
        "refreshToken",
        generatedRefreshToken,
        optionsForRefreshTokenCookie
      )
      .json(
        new ApiResponse(
          200,
          {
            accessToken: generatedAccessToken,
            refreshToken: generatedRefreshToken,
          },
          "successfully generated Access and refresh token"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  //one case possible if user login or not then it should able to access this route
  //password body current and new password
  // error handling
  //check if current password for user is matched in db
  // if matched then update the password in db
  // if not matched then throw error
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(422, "current password and new password is required");
  }
  if (currentPassword.length < 6 || newPassword.length < 6) {
    throw new ApiError(411, "password should be at least of 6 letters");
  }
  if (!RegExp(passwordRegex).test(currentPassword)) {
    throw new ApiError(
      406,
      "Password must contains a Capital letter,spacial symbol and number"
    );
  }

  if (!RegExp(passwordRegex).test(newPassword)) {
    throw new ApiError(
      406,
      "Password must contains a Capital letter,spacial symbol and number"
    );
  }

  if (currentPassword === newPassword) {
    throw new ApiError(406, "New password is same as current password");
  }
  const user = await User.findById(req.user._id); //see in auth middleware

  if (!user) {
    throw new ApiError(404, "User does not existed");
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user password");

  user.password = newPassword;
  await user.save({ ValidateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Current password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log(fullName, email);
  if (!fullName || !email) {
    throw new ApiError(422, "fullName and email is required");
  }
  if (fullName.length < 3) {
    throw new ApiError(411, "fullName  should be at least of 6 letters");
  }
  if (!RegExp(emailRegex).test(email)) {
    throw new ApiError(406, "Invalid email");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account detail updated Successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarFilePath = req.file?.path; // .file due to single file
  if (!avatarFilePath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const { mimetype, size } = req.file;

  // Validate file type
  if (!allowedMimeTypes.includes(mimetype)) {
    throw new ApiError(
      415,
      "Unsupported file type. Allowed formats are: JPEG, PNG, JPG, WebP, AVIF, GIF"
    ); // 415 Unsupported Media Type
  }

  // Validate file size
  if (size < MIN_FILE_SIZE || size > MAX_FILE_SIZE) {
    throw new ApiError(
      413,
      `File size must be between ${MIN_FILE_SIZE / 1024} KB and ${
        MAX_FILE_SIZE / 1024 / 1024
      } MB` // 413 Payload Too Large
    );
  }

  const avatar = await uploadFileCloudinary(avatarFilePath);
  if (!avatar.url && !avatar.publicId) {
    throw new ApiResponse(400, "Avatar file is not uploaded");
  }
  const deleteOldAvatarImage = await deleteFileFromCloudinary(
    req.user?.avatar.publicId
  );

  if (!deleteOldAvatarImage) {
    throw new ApiResponse(400, "Avatar file is not deleted");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: { url: avatar.url, publicId: avatar.publicId },
      },
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User does not existed");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: avatar.url },
        "Avatar updated successfully"
      )
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  // console.log(userName, req.params);
  if (!userName?.trim()) {
    throw new ApiError(400, "userName is required in params");
  }
  const channel = await User.aggregate([
    { $match: { userName: userName?.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id", //it will refer to the _id of the user object it is the field of current model which is user now
        foreignField: "channelId",
        as: "subscribers", //lowercase name will be of model and become plural 's
      },
    },
    {
      $lookup: {
        //it is for the youtuber who subscribed which channels
        from: "subscriptions",
        localField: "_id", //it will refer to the _id of the user object
        foreignField: "subscriberId",
        as: "subscribedChannels", //lowercase name will be of model and become plural 's
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers", //added $ due to field refer line ~501
        },
        subscribedChannelsCount: { $size: "$subscribedChannels" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, //in this where are finding subscribed or not [from,where]
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        userName: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: 1,
        subscribedChannels: 1,
        subscriberCount: 1,
        subscribedChannelsCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  console.log(channel);
  if (!channel?.length) {
    throw new ApiError(404, "User does not existed");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User fetched successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "userId is required in params");
  }
  const watchHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
        "watchHistory.0": { $exists: true },
      },
    },
    {
      $project: {
        _id: 0,
        watchHistory: 1,
      },
    },
    { $unwind: "$watchHistory" },
    {
      $sort: { "watchHistory.lastWatchedAt": -1 },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory.videoId",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "channelOwner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    userName: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$channelOwner",
          },
        ],
      },
    },
    {
      $project: {
        VideoId: "$watchHistory.videoId",
        thumbnail: { $first: "$video.thumbnail.url" },
        title: { $first: "$video.title" },
        description: { $first: "$video.description" },
        channelOwner: { $first: "$video.channelOwner.userName" },
        channelOwnerId: { $first: "$video.channelOwner._id" },
        views: { $first: "$video.views" },
        lastWatchedAt: "$watchHistory.lastWatchedAt",
      },
    },
  ]);
  if (!watchHistory?.length) {
    throw new ApiError(404, "watchHistory does not existed");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, watchHistory, "watchHistory fetched successfully")
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getUserWatchHistory,
};
