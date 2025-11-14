import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connection successful");
        
    } catch (error) {
        console.log("Connection Failed", error);
        
    }
}

export default connectDB;