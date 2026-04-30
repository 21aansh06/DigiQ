import express from "express";
import { requestOTP, verifyOTP } from "../controllers/otpController.js";

const otpRouter = express.Router();

otpRouter.post("/request", requestOTP);
otpRouter.post("/verify", verifyOTP);

export default otpRouter;
