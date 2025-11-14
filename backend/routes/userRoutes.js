import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    user = new User({ name, email, password });
    await user.save();

    const payload = { id: user._id, role: user.role };
    // *** DEBUG LOG: Check payload before signing for register ***
    console.log("Register - Payload before signing token:", payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
   //  { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error("JWT signing error (register):", err);
          return res.status(500).json({ message: "Token generation failed" });
        }
        // send the user and token in response.
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Register error:", error); // Use console.error for errors
    res.status(500).send("server error"); // Removed 'error' from send, as it expects a string or buffer
  }
});

// @route Post /api/users/login
// @desc authication user
// @ access piblic.

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT payload
    const payload = {
      id: user._id,
      role: user.role,
    };
    // *** DEBUG LOG: Check payload before signing for login ***
    console.log("Login - Payload before signing token:", payload);

    // 4. Sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
     //expiresIn: "7d",
    });

    // 5. Respond with user info and token
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET/api/users/profile
// @desc get logged-in users's profile (Protected Route)
// @access privete

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
