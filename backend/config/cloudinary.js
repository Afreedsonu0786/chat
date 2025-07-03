import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import dotenv from "dotenv";

dotenv.config();
const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    await fs.unlink(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    await fs.unlink(filePath);
    console.log(error);
  }
};

export default uploadOnCloudinary;
