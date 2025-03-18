// First, let's define our TypeScript interfaces

// src/types/index.ts
export interface User {
    id: string;
    email: string;
    role: 'teacher' | 'student';
  }
  
  export interface Question {
    text: string;
    options: string[];
    correctAnswer?: number; // Only visible to teachers
  }
  
  export interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: Question[];
    createdBy: string;
    createdAt: string;
    timeLimit: number;
  }
  
  export interface QuizResult {
    _id: string;
    quizId: string;
    quizTitle: string;
    studentId: string;
    studentEmail: string;
    teacherId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    answers: number[];
    timestamp: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
  }