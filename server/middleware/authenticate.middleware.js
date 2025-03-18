import User from "../models/User.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};


const isTeacher = (req, res, next) => {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Only teachers can perform this action' });
    }
    next();
};

export { authenticate, isTeacher };


  
  