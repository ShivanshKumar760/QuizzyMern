import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    quizTitle: {
      type: String,
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentEmail: {
      type: String,
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    answers: {
      type: [Number],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });

export default resultSchema;