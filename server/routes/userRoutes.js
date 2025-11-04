import express, { Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/userAuthController.js"

const userRouter = express.Router()

userRouter.post("/register" , registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)


export default userRouter