import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  name: { type: String, required: true },
  description: { type: String },
  averageTimePerCustomer: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
});

 const Service = mongoose.model("Service", serviceSchema);
 export default Service
