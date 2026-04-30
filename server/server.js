import express from "express"
import "dotenv/config"
import connectDB from "./config/connectDB.js"
import cookieParser from "cookie-parser"
import orgRouter from "./routes/orgRoutes.js"
import userRouter from "./routes/userRoutes.js"
import serviceRouter from "./routes/serviceRoutes.js"
import queueRouter from "./routes/queueRoutes.js"
import otpRouter from "./routes/otpRoutes.js"
import cors from "cors"
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

connectDB()
const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL

const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"]
app.use(cors({ credentials: true, origin: allowedOrigins }))

app.use("/api/auth/user", userRouter)
app.use("/api/auth/org", orgRouter)
app.use("/api/service", serviceRouter)
app.use("/api/queues", queueRouter);
app.use("/api/otp", otpRouter);

app.get("/", (req, res) => {
    res.json({ message: "Listening" })
})

httpServer.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})
