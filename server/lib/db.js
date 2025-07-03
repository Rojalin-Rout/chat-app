import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
  try {
    console.log("🧪 MONGODB_URL:", process.env.MONGODB_URL); // DEBUG line
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
