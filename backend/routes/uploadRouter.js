// backend/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { protect,admin } from "../Middleware/authMiddleware.js";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// This route returns the secure_url upon successful upload.
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ imageUrl: result.secure_url }); // This is the successful response!
  } catch (error) {
    console.error("Upload failed:", error); // This log indicates a *real* upload error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;