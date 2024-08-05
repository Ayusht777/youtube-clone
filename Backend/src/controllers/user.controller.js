import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFileCloudinary } from "../service/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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

  if (password.length < 8) {
    throw new ApiError(
      422,
      "Password must be at least 8 characters"
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

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //remove password & refresh token

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created"));
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

  if (!userName || !email) {
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
  if (password.length < 8) {
    throw new ApiError(411, "password should be at least of 8 letters");
  } else if (!RegExp(passwordRegex).test(password)) {
    throw new ApiError(
      406,
      "Password must contains a Capital letter,spacial symbol and numbe"
    );
  }

  const checkUser = await User.findOne({ $or: [{ email }, { userName }] });

  if(!checkUser){
    throw new ApiError()
  }
});

export { registerUser, loginUser };
