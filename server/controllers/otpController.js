import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendOTP } from "../utils/twilioService.js";

let otpStore = {}; // In-memory temporary store

// 🟢 STEP 1: Send OTP
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // ensure string
    otpStore[phone] = otp;

    // send otp via Twilio (mock if Twilio not set)
    await sendOTP(phone, otp);

    console.log(`✅ OTP for ${phone}: ${otp}`); // for testing

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// 🟢 STEP 2: Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    console.log("Received OTP verify request:", req.body);

    // Check for missing fields
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    // Convert both to strings to avoid mismatch
    const storedOTP = otpStore[phone]?.toString();
    if (!storedOTP || storedOTP !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Delete OTP after verification
    delete otpStore[phone];

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this phone number. Please register first.",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
      token,
      user,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
      error: error.message,
    });
  }
};
