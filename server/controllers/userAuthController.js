import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const registerUser = async(req,res)=>{
    let {email,name , password , phone} = req.body
    if(!email || !name || !password){
        return res.json({success:false , message:"Fill all the details"})
    }
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({success:false , message:"User already exists"})
        }
        const hashPassword = await bcrypt.hash(password , 10)
        const newUser = new User({
            email:email,
            name:name,
            password:hashPassword,
            phone
        })

        await newUser.save()
        
        const token = jwt.sign({id: newUser._id} , process.env.JWT_SECRET , {expiresIn: "7d"})
        res.cookie("token" , token , {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success:true , message:"User registered"})

    } catch (error) {
        res.json({success: false , message:error.message})
    }
}
export const loginUser = async(req,res)=>{
    let {email , password} = req.body
    if(!email || !password){
        return res.json({success:false, message:"Fill all details"})
    }
    try {
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.json({success:false , message:"User not found"})
        }
        const isPassMatch = await bcrypt.compare(password , existingUser.password)
        if(!isPassMatch){
            return res.json({success:false , message:"Details doesn't match"})
        }
        const token = jwt.sign({id: existingUser._id} , process.env.JWT_SECRET , {expiresIn: "7d"})

        res.cookie("token" , token , {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success:true , message: "User logged in" , user:{
            _id: existingUser._id,
            name: existingUser.name,
            role: existingUser.role
        }})

    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}
export const logoutUser = async(req,res)=>{
    try {
        res.clearCookie("token" , {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.json({success:true , message: "Logged out successfully"})

    } catch (error) {

         res.json({success: false , message: error.messgae})
    }
}