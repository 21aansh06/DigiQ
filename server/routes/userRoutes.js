import express, { Router } from "express"
import { loginUser, logoutUser, registerUser, getUserProfile } from "../controllers/userAuthController.js"
import userMiddleware from "../middlewares/userMiddleware.js"

const userRouter = express.Router()

userRouter.post("/register" , registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)
userRouter.get("/me", userMiddleware, getUserProfile)


export default userRouter