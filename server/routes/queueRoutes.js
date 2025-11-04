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

// User joins a queue for a specific service
queueRouter.post("/:serviceId/join", userMiddleware, joinQueue);
queueRouter.get("/service/:serviceId" , getServiceQueues)

// Organization views all queues for itself
queueRouter.get("/org/:orgId", orgMiddleware, getOrgQueues);

// User views their queues
queueRouter.get("/user", userMiddleware, getUserQueues);

// Organization updates queue status
queueRouter.put("/:queueId", orgMiddleware, updateQueueStatus);

// Organization deletes a queue
queueRouter.delete("/:queueId", orgMiddleware, deleteQueue);

export default queueRouter;
