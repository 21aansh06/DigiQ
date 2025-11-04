import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  address: { type: String },
  password:{type:String , required :true},
  type: { 
    type: String, 
    enum: ["hospital", "bank", "office", "clinic"], 
    required: true 
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  qrCode: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Organization =  mongoose.model("Organization", organizationSchema);
export default Organization

