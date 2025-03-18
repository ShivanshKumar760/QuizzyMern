import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authenticate,isTeacher } from "../middleware/authenticate.middleware.js";
dotenv.config();


export const getQuizzes = async (req, res) => {
    try{
        const quizzes = await Quiz.find({},'-questions.correctAnswer');
        res.json(quizzes);
    }catch(error){
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const createQuiz = async (req, res) => {
    try{
        const newQuiz=new Quiz({...req.body, createdBy: req.user._id});
        const quiz = await Quiz.create(newQuiz);
        res.json(quiz);
    }catch(error){
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateQuiz=async (req,res)=>{
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        
        if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }
        
        if (quiz.createdBy.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'You can only update your own quizzes' });
        }
        
        Object.assign(quiz, req.body);
        await quiz.save();
        
        res.json(quiz);
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const deleteQuiz=async (req,res)=>{
    try{
        const {id}=req.params;
        const quiz=await Quiz.findById(id);
        if(!quiz) return res.status(404).json({message:"Quiz not found"});
        if(quiz.createdBy.toString()!==req.user._id.toString()) return res.status(403).json({message:"You can only delete your own quizzes"});

        await Quiz.findByIdAndDelete(id);
        res.json({ success: true });
    }catch(error){
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const takeQuizTest=async (req,res)=>{
    try{
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        const {answers} = req.body;
        console.log(quiz);
        console.log(quiz.questions);
        console.log(req.body);
        if (!quiz){
            return res.status(404).json({ message: 'Quiz not found' });
        }
        let score = 0;
        let totalQuestions = quiz.questions.length;
        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === req.body.answers[index]) {
                score++;
            }
        });
         
        const percentage = (score / totalQuestions) * 100;

        const result = new Result({
            quizId: quiz._id,
            quizTitle: quiz.title,
            studentId: req.user._id,
            studentEmail: req.user.email,
            teacherId: quiz.createdBy,
            score,
            totalQuestions,
            percentage,
            answers
        });


        await Result.create(result);
        res.json({
            success: true,
            result: {
              quizTitle: quiz.title,
              score,
              totalQuestions,
              percentage
            }
        });
          
    }
    catch(error){
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }


};


export const myResults= async (req, res) => {
    try {
      const results = await Result.find({ studentId: req.user._id });
      res.json(results);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const allStudents_Quiz_Results= async (req, res) => {
    try {
      const results = await Result.find({ teacherId: req.user._id });
      res.json(results);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const specificQuizResults= async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      if (quiz.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only view results for your own quizzes' });
      }
      
      const results = await Result.find({ quizId: id });
      res.json(results);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


export const getQuizQuestions = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the quiz by ID
        const quiz = await Quiz.findById(id);
        
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        
        // Check if the request is from the quiz creator (teacher)
        const isCreator = quiz.createdBy.toString() === req.user._id.toString();
        
        // If the user is not the creator, remove correct answers
        let quizData;
        if (isCreator) {
            // Send complete quiz with correct answers to creator
            quizData = quiz;
        } else {
            // For students or other users, remove correct answers
            quizData = quiz.toObject();
            quizData.questions = quizData.questions.map(question => {
                const { correctAnswer, ...questionWithoutAnswer } = question;
                return questionWithoutAnswer;
            });
        }
        
        res.json({
            success: true,
            quiz: quizData
        });
        
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};