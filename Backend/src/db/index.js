import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("DB Connected");
  } catch (error) {
    console.log(`MongoDB connection error ${error}`);
    throw error;
    process.exit(1);
  }
};
