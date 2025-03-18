import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const loginUser = async (req, res) => {
    const {email,password,role}=req.body;
    try {
        const existingUser=await User.findOne({email});
        if(!existingUser) return res.status(404).json({message:"User does not exist"});

        const isPasswordValid=bcrypt.compareSync(password,existingUser.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid credentials"});

        const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            success: true, 
            user: { 
              id: existingUser._id, 
              email: existingUser.email, 
              role: existingUser.role 
            },
            token 
        });
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const registerUser = async (req,res)=>{
    const {email,password,role}=req.body;
    try {
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exists"});

        const hashedPassword=bcrypt.hashSync(password,10);
        const newuser=new User({email,password:hashedPassword,role});
        
        const user=await User.create(newuser);
         // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
        res.json({ 
        success: true, 
        user: { 
            id: user._id, 
            email: user.email, 
            role: user.role 
        },
        token 
        });
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};