import jwt from "jsonwebtoken";
import Organization from "../models/organizationModel.js";

const orgMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const organization = await Organization.findById(decoded.id);

    if (!organization) {
      return res.status(401).json({ success: false, message: "Organization not found" });
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

