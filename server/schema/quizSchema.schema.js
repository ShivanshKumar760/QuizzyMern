import mongoose from "mongoose";
import questionSchema from "./questionSchema.schema.js";

const quizSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    timeLimit: {
      type: Number,
      default: 0 // 0 means no time limit (in minutes)
    }
  });

export default quizSchema;