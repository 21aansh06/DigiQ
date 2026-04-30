import express from "express"
import { loginOrg, registerOrg, getOrgProfile, logoutOrg, generateOrgQRCode, getMyOrg } from "../controllers/orgAuthController.js"
import userMiddleware from "../middlewares/userMiddleware.js"
import orgMiddleware from "../middlewares/orgMiddleware.js"

const orgRouter = express.Router()

orgRouter.post("/register", userMiddleware, registerOrg)
orgRouter.post("/login", loginOrg)
orgRouter.get("/me", orgMiddleware, getOrgProfile)
orgRouter.get("/my-org", userMiddleware, getMyOrg)
orgRouter.post("/logout", logoutOrg)
orgRouter.get("/qrcode/:orgId", generateOrgQRCode);

export default orgRouter