import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";
import { generateCustomId } from "./idGenerator.js";
import { sendVerificationEmail } from "./mailer.js";

const router = express.Router();

// ===== Signup =====
router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, device_name, ip_address } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const custom_id = await generateCustomId("TRU");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      custom_id,
      first_name,
      last_name,
      username: username || email.split("@")[0], // fallback if username missing
      email,
      password: hashedPassword,
      device_name,
      ip_address,
      verification_code: verificationCode,
      is_verified: false
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    res.json({ success: true, message: "Signup successful. Please check your email for the verification code.", custom_id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ===== Verify =====
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.verification_code !== code) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    user.is_verified = true;
    user.verification_code = null;
    await user.save();

    res.json({ success: true, message: "Account verified successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.is_verified) return res.status(403).json({ success: false, message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.custom_id }, "truzone_secret", { expiresIn: "7d" });

    res.json({ success: true, message: "Login successful.", token, custom_id: user.custom_id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;