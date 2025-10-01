import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully...");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1); // optional: exit app on failure
  }
};

export default connectToDB;
