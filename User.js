import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  custom_id: { type: String, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_pic: { type: String, default: "https://cdn.truzone.com/default.png" },
  bio: { type: String, default: "" },
  followers_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  device_name: { type: String },
  ip_address: { type: String },
  created_at: { type: Date, default: Date.now },
  is_verified: { type: Boolean, default: false },
  verification_code: { type: String }
});

export default mongoose.model("User", userSchema);
