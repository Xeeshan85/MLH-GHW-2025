import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

export function createAuthRouter(secretKey) {
  const router = express.Router();

  // --- REGISTER ---
  router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password)
        return res.status(400).json({ message: "Username, email, and password are required." });

      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ message: "Username already exists." });

      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        return res.status(400).json({ message: "Email already exists." });

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ message: "Server error during registration." });
    }
  });

  // --- LOGIN ---
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user)
        return res.status(401).json({ message: "Invalid username or password." });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid username or password." });

      const token = jwt.sign(
        { id: user._id, username: user.username },
        secretKey,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ message: "Server error during login." });
    }
  });

  return router;
}

export default createAuthRouter;