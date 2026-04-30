import jwt from "jsonwebtoken";
import Organization from "../models/organizationModel.js";
import User from "../models/userModel.js";

const orgMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let organization = await Organization.findById(decoded.id);

    // If not found as organization ID, check if it's a User ID with organization role
    if (!organization) {
      const user = await User.findById(decoded.id);
      if (user && user.role === 'organization') {
        organization = await Organization.findOne({ createdBy: user._id });
      }
    }

    if (!organization) {
      return res.status(401).json({ success: false, message: "Organization not found or unauthorized" });
    }

    req.org = {
      id: organization._id,
      email: organization.email,
      name: organization.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default orgMiddleware;

