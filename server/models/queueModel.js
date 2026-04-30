import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["waiting", "in_progress", "completed", "cancelled"], 
    default: "waiting" 
  },
  joinedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  estimatedWaitTime: { type: Number }, 
  isRemote: { type: Boolean, default: false },
});


const Queue = mongoose.model("Queue", queueSchema);
export default Queue
