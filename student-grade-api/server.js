import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST, before importing routes
dotenv.config();

import mongoose from "mongoose";
import studentRoutes from "./routes/students.js";
import { createAuthRouter } from "./routes/auth.js";
import User from "./models/users.js";
import { authenticationToken } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// -- MongoDB Connection --
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Create Auth Router with Secret ---
const authRoutes = createAuthRouter(JWT_SECRET);

// --- Helper Functions ---

// Validate student ID
function isValidStudentId(id) {
  const regex = /^S2025\d{4}$/;
  return regex.test(id);
}

export { isValidStudentId };

// --- Routes ---

app.get("/", (req, res) => {
  res.send("Welcome to the Student Grade API!");
});
app.use("/auth", authRoutes);

app.use("/students", authenticationToken, studentRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});