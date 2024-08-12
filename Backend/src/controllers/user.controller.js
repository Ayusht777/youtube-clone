import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFileCloudinary } from "../service/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
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
  maxAge: 15 * 60 * 1000, // 15 minutes
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
  if (
    [email, password, userName, fullName].some(
      (inputFields) => inputFields?.trim == "" //trim used to remove space
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (userName.length <= 3) {
    throw new ApiError(422, "Username must be at least 3 characters");
  }

  if (fullName.length <= 3) {
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

  const { mimetype, size } = avatar;

  // Validate file type
  if (allowedMimeTypes.includes(mimetype)) {
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
    const { mimetype, size } = coverImage;
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

  const avatarUrl = await uploadFileCloudinary(avatar);

  if (!avatarUrl) {
    throw new ApiError(500, "Failed to upload avatar. Please try again.");
  }

  let coverImageUrl = "";
  if (coverImage) {
    coverImageUrl = await uploadFileCloudinary(coverImage);
    if (!coverImageUrl) {
      throw new ApiError(
        500,
        "Failed to upload cover image. Please try again."
      );
    }
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    avatar: avatarUrl,
    coverImage: coverImageUrl?.url || "",
    password,
  });

  console.log(user);

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
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

  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  if (!userName && !email) {
    throw new ApiError(422, "username & email is required");
  }
  if (!password) {
    throw new ApiError(422, "Password is required");
  }

  if (userName.length <= 3) {
    throw new ApiError(411, "username should be at least of 3 letters");
  }
  if (!RegExp(emailRegex).test(email)) {
    throw new ApiError(406, "enter a valid email");
  }
  if (password.length < 6) {
    throw new ApiError(411, "password should be at least of 6 letters");
  } else if (!RegExp(passwordRegex).test(password)) {
    throw new ApiError(
      406,
      "Password must contains a Capital letter,spacial symbol and numbe"
    );
  }

  const checkedUser = await User.findOne({ $or: [{ email }, { userName }] });

  if (!checkedUser) {
    throw new ApiError(403, "user does not existed existed");
  }

  const isPassword = await checkedUser.isPasswordCorrect(password);
  if (!isPassword) throw new ApiError(401, "Invalid User Password");

  // if (!checkedUser.isPasswordCorrect(password)) {
  //   throw new ApiError(401, "Invalid User Password");
  // }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(checkedUser._id);

  const loggedInUser = await User.findById(checkedUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, optionsForAccessTokenCookie)
    .cookie("refreshToken", refreshToken, optionsForRefreshTokenCookie)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  return res
    .status(200)
    .cookie("accessToken", optionsForAccessTokenCookie)
    .cookie("refreshToken", optionsForRefreshTokenCookie)
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

export { registerUser, loginUser, logoutUser, refreshAccessToken };
