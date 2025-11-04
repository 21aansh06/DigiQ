import Queue from "../models/queueModel.js";
import Service from "../models/serviceModel.js";

export const joinQueue = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Please login first" 
      });
    }

    if (!serviceId) {
      return res.status(400).json({ 
        success: false, 
        message: "Service ID is required" 
      });
    }

    const service = await Service.findById(serviceId).populate("organization");
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: "Service not found" 
      });
    }

    if (!service.organization) {
      return res.status(400).json({ 
        success: false, 
        message: "Service organization not found" 
      });
    }

    const organization = service.organization;
    const orgId = organization._id;

    // Check if user already in queue (waiting or in_progress)
    const existing = await Queue.findOne({
      user: userId,
      service: serviceId,
      status: { $in: ["waiting", "in_progress"] }
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already in the queue for this service" 
      });
    }

    // Generate token number (incremental per service)
    const lastEntry = await Queue.findOne({ service: serviceId })
      .sort({ tokenNumber: -1 });
    const tokenNumber = lastEntry ? lastEntry.tokenNumber + 1 : 1;

    // Calculate estimated wait time (averageTimePerCustomer * positionInQueue)
    // Only count waiting queues (not in_progress, as those are already being served)
    const waitingCount = await Queue.countDocuments({
      service: serviceId,
      status: "waiting"
    });

    const positionInQueue = waitingCount + 1; // +1 because this user will be added
    const avgTime = service.averageTimePerCustomer || 10;
    const estimatedWaitTime = positionInQueue * avgTime;

    const newQueue = await Queue.create({
      user: userId,
      service: serviceId,
      organization: orgId,
      tokenNumber,
      estimatedWaitTime,
    });

    res.status(201).json({
      success: true,
      message: "Joined queue successfully",
      queue: newQueue,
    });
  } catch (error) {
    console.error("Error joining queue:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to join queue" 
    });
  }
};
// GET /api/queue/service/:serviceId
export const getServiceQueues = async (req, res) => {
  try {
    const { serviceId } = req.params; // extract the serviceId properly

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const queues = await Queue.find({ service: serviceId }) // field name is "service", not "serviceId"
      .populate("user", "name phone")
      .sort({ tokenNumber: 1 });

    // Calculate estimated wait time for each queue entry
    // Only count waiting queues before this one (not in_progress or completed)
    const queuesWithEstimate = queues.map((queue) => {
      const waitingBefore = queues.filter(
        (q) => q.status === "waiting" && q.tokenNumber < queue.tokenNumber
      ).length;
      const avgTime = service.averageTimePerCustomer || 10;
      
      // Only show estimate for waiting status
      if (queue.status === "waiting") {
        const estimatedWaitTime = (waitingBefore + 1) * avgTime;
        return {
          ...queue.toObject(),
          estimatedWaitTime,
        };
      }
      return queue.toObject();
    });

    return res.status(200).json({
      success: true,
      queues: queuesWithEstimate,
      service: {
        averageTimePerCustomer: service.averageTimePerCustomer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// 🟦 Get all queues for a specific organization (for org dashboard)
export const getOrgQueues = async (req, res) => {
  try {
    const { orgId } = req.params;

    const queues = await Queue.find({ organization: orgId })
      .populate("user", "name email phone")
      .populate("service", "name avgTime");

    res.status(200).json({ success: true, queues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟨 Update queue status (only organization owner)
export const updateQueueStatus = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { status } = req.body;

    if (!["waiting", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const queue = await Queue.findById(queueId).populate("organization");
    if (!queue) {
      return res.status(404).json({ success: false, message: "Queue not found" });
    }

    // Verify that the queue belongs to the logged-in organization
    if (queue.organization._id.toString() !== req.org.id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: not your organization's queue" 
      });
    }

    queue.status = status;

    if (status === "completed") {
      queue.completedAt = new Date();
    }

    await queue.save();

    res.status(200).json({ success: true, message: "Queue status updated", queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟧 Get all queues for logged-in user
export const getUserQueues = async (req, res) => {
  try {
    const userId = req.user.id;

    const queues = await Queue.find({ user: userId })
      .populate("service", "name description avgTime")
      .populate("organization", "name");

    res.status(200).json({ success: true, queues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟥 Delete a queue (only organization owner)
export const deleteQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findById(queueId).populate("organization");

    if (!queue) {
      return res.status(404).json({ success: false, message: "Queue not found" });
    }

    // Verify that the queue belongs to the logged-in organization
    if (queue.organization._id.toString() !== req.org.id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: not your organization's queue" 
      });
    }

    await queue.deleteOne();

    res.status(200).json({ success: true, message: "Queue deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
