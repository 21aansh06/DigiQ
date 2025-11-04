import express from "express";
import { requestOTP, verifyOTP } from "../controllers/otpController.js";

const otpRouter = express.Router();

// Send OTP
otpRouter.post("/request", requestOTP);

// Verify OTP
otpRouter.post("/verify", verifyOTP);

export default otpRouter;
