import express from "express"
import { addService, getAllServices, getOrgServices, updateService } from "../controllers/serviceController.js"
import orgMiddleware from "../middlewares/orgMiddleware.js"

const serviceRouter = express.Router()

// More specific routes first
serviceRouter.get("/org/:orgId", getOrgServices);
serviceRouter.post("/" , orgMiddleware, addService)
serviceRouter.get("/", getAllServices)
serviceRouter.put("/:serviceId", orgMiddleware, updateService);

export default serviceRouter