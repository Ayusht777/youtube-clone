import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFileCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null; //no file path then return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded successfully
    console.log(`File is Uploaded on Cloudnairy -> ${response}`);
    return response; // ideally should return url
  } catch (error) {
    fs.unlinkSync(localFilePath); // reomve file sync way in tempoary storage of server as the upload got failed
    return null;
  }
};

export {uploadFileCloudinary}