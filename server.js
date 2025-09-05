import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./userRoutes.js";

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // replaces bodyParser.json()

// ===== MongoDB connection =====
mongoose.connect(
  "mongodb+srv://truzone:ilGJySKdQfcQn2pA@cluster0.tutojxn.mongodb.net/Truzone?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Routes =====
app.use("/api/auth", userRoutes);

// Health check route (to test deployment easily)
app.get("/", (req, res) => {
  res.send("✅ Truzone Auth API is running");
});

// ===== Server Listen =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));