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

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const custom_id = await generateCustomId("TRU");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      custom_id,
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      device_name,
      ip_address,
      verification_code: verificationCode
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    res.json({ message: "Signup successful. Please check your email for the verification code.", custom_id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== Verify =====
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verification_code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.is_verified = true;
    user.verification_code = null;
    await user.save();

    res.json({ message: "Account verified successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.is_verified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.custom_id }, "truzone_secret", { expiresIn: "7d" });

    res.json({ message: "Login successful.", token, custom_id: user.custom_id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
