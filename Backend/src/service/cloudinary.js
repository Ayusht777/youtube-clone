import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/config.js";
cloudinary.config({
  cloud_name: config.cloud_api_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
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
    fs.unlinkSync(localFilePath); //remove the local file after uploading to cloudinary
    return { url: response.secure_url, publicId: response.public_id };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }
};

const deleteFileFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new ApiError(400, "No public id provided");
    }
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("File is Deleted from Cloudinary -> ", response);
    if (response.result == "ok") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};

export { uploadFileCloudinary, deleteFileFromCloudinary };
