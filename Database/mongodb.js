import mongoose from "mongoose";
import { DATABASE_URL, NODE_ENV } from "../config/env.js";

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log(`Connected to MongoDB successfully in ${NODE_ENV} mode.`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectToDatabase;