import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: "dwanlo5fg",
  api_key: "591242146842586",
  api_secret: "Nz7q8lPAn_z5VOez9CnBFnQ-6lk",
});

const uploadFileCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "No file path provided");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is Uploaded on Cloudinary -> ", response);
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }
};

export { uploadFileCloudinary };
