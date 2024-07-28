import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`DB Connected -> ${connectionInstance.connection.host} `);
  } catch (error) {
    console.log(`MongoDB connection error ${error}`);
    throw error;
    process.exit(1);
  }
};
