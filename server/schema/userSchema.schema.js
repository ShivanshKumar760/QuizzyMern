import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['teacher', 'student'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});


export default userSchema;