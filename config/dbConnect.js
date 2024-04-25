// db.js

import mongoose from "mongoose";

const connectDB = async () => {
    // console.log(process.env.MONGO_URL ||)
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://dhavalll63:dks123@cluster0.c8vw6id.mongodb.net/task1");
        console.log("Connected to database");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

export default connectDB;
