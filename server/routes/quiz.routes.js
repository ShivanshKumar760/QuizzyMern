import express from 'express';
import {getQuizzes,createQuiz,updateQuiz,deleteQuiz,takeQuizTest,myResults,allStudents_Quiz_Results,
    specificQuizResults,
    getQuizQuestions
} from '../controllers/quiz.controller.js';
import {authenticate,isTeacher} from '../middleware/authenticate.middleware.js';

const router=express.Router();

// Quiz routes
router.get('/api/quizzes', getQuizzes);
  
  // Only teachers can create quizzes
router.post('/api/quizzes', authenticate, isTeacher, createQuiz);
  
  // Only the teacher who created the quiz can update it
router.get('/api/quizzes/:id', authenticate,  getQuizQuestions);
router.put('/api/quizzes/:id', authenticate, isTeacher, updateQuiz);
  
  // Only the teacher who created the quiz can delete it
router.delete('/api/quizzes/:id', authenticate, isTeacher, deleteQuiz);
  
  // Student takes a quiz
router.post('/api/quizzes/:id/take', authenticate, takeQuizTest);
  
  // Student gets their quiz results
router.get('/api/results/me', authenticate, myResults);
  
  // Teacher gets results for their quizzes
router.get('/api/results/teacher', authenticate, isTeacher, allStudents_Quiz_Results);
  
  // Teacher gets results for a specific quiz they created
router.get('/api/quizzes/:id/results', authenticate, isTeacher, specificQuizResults);


export default router;