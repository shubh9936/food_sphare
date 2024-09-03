import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shubhgupta066:Shubh123@cluster0.x3kjx.mongodb.net/food-del');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB connection error:", error.message);
        process.exit(1); // Exit the process with a failure code
    }
}
