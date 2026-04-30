import express from "express";
import {
  joinQueue,
  getOrgQueues,
  getUserQueues,
  updateQueueStatus,
  deleteQueue,
  getServiceQueues,
} from "../controllers/queueController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import orgMiddleware from "../middlewares/orgMiddleware.js";

const queueRouter = express.Router();

queueRouter.post("/:serviceId/join", userMiddleware, joinQueue);
queueRouter.get("/service/:serviceId", getServiceQueues)
queueRouter.get("/org/:orgId", orgMiddleware, getOrgQueues);
queueRouter.get("/user", userMiddleware, getUserQueues);
queueRouter.put("/:queueId", orgMiddleware, updateQueueStatus);
queueRouter.delete("/:queueId", orgMiddleware, deleteQueue);

export default queueRouter;
