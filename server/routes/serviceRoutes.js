import express from "express"
import { addService, deleteService, getAllServices, getOrgServices, updateService } from "../controllers/serviceController.js"
import orgMiddleware from "../middlewares/orgMiddleware.js"

const serviceRouter = express.Router()

serviceRouter.get("/org/:orgId", getOrgServices);
serviceRouter.post("/" , orgMiddleware, addService)
serviceRouter.get("/", getAllServices)
serviceRouter.put("/:serviceId", orgMiddleware, updateService);
serviceRouter.delete("/:serviceId", orgMiddleware, deleteService);

export default serviceRouter