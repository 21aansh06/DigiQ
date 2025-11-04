import Organization from "../models/organizationModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import QRCode from "qrcode";

export const registerOrg = async (req, res) => {
    try {
        const { name, email, password, address, type } = req.body;
        if (!email || !name || !password || !address || !type) {
            return res.json({ success: false, message: "Provide all details" })
        }

        const existingUser = await Organization.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newOrg = new Organization({
            email,
            name,
            password: hashPassword,
            address,
            type,
            createdBy:req.user.id
        })
        await newOrg.save()
        const token = jwt.sign({ id: newOrg._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ success: true, message: "Organization registered" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const loginOrg = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Provide all details" })
        }
        const existingOrg = await Organization.findOne({ email });
        if (!existingOrg) {
            return res.json({ success: false, message: "Please register first" })
        }
        const isPassMatch = await bcrypt.compare(password, existingOrg.password)
        if (!isPassMatch) {
            return res.json({ success: false, message: "Details doesn't match" })
        }
        const token = jwt.sign({ id: existingOrg._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
         return res.json({success:true , message: "Organization logged in" , organization: existingOrg})


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getOrgProfile = async (req, res) => {
    try {
        const organization = await Organization.findById(req.org.id);
        if (!organization) {
            return res.json({ success: false, message: "Organization not found" });
        }
        res.json({ success: true, organization });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const logoutOrg = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const generateOrgQRCode = async (req, res) => {
  try {
    const { orgId } = req.params;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    const qrData = `${process.env.FRONTEND_URL}/organization/${organization._id}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.json({
      success: true,
      qrCode,
      message: "QR Code generated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

