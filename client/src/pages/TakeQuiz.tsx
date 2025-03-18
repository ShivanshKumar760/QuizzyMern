// src/pages/TakeQuiz.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Header from '../components/Header';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: {
    _id: string;
    text: string;
    options: string[];
  }[];
  timeLimit: number;
}

interface QuizResult {
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
//   const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/quizzes/${id}`);
        console.log(response.data);
        const quizData = response.data.quiz;
        
        setQuiz(quizData);
        
        // Initialize answers array
        setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
        
        // Set timer if quiz has time limit
        if (quizData.timeLimit > 0) {
          setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Handle timer countdown
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !result) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up, submit quiz automatically
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, result]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // Navigate between questions
  const goToNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    if (!quiz) return;
    
    // Check if all questions are answered
    const unansweredQuestions = selectedAnswers.filter(answer => answer === -1).length;
    if (unansweredQuestions > 0 && !window.confirm(`You have ${unansweredQuestions} unanswered question(s). Submit anyway?`)) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await api.post(`/api/quizzes/${id}/take`, {
        answers: selectedAnswers
      });
      
      setResult(response.data.result);
      
      // Clear timer if it exists
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(errorMessage);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if student has attempted all questions
  const hasAnsweredAll = (): boolean => {
    return selectedAnswers.every(answer => answer !== -1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4 text-center py-12">
          <div className="text-xl">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4 text-center py-12">
          <div className="text-xl">Quiz not found</div>
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show result if quiz has been submitted
  if (result) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{result.quizTitle}</h2>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <div className="text-5xl font-bold mb-2 text-purple-600">
                  {result.percentage.toFixed(1)}%
                </div>
                <div className="text-lg">
                  Score: {result.score} / {result.totalQuestions}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            {timeRemaining !== null && (
              <div className={`text-lg font-semibold ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : ''}`}>
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Question {currentQuestion + 1} of {quiz.questions.length}</h2>
              <div className="text-sm text-gray-500">
                {selectedAnswers.filter(a => a !== -1).length} of {quiz.questions.length} answered
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(selectedAnswers.filter(a => a !== -1).length / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-lg mb-4">{currentQuestionData.text}</div>
            
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 
                    ${selectedAnswers[currentQuestion] === index ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border 
                      ${selectedAnswers[currentQuestion] === index ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-400'}`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>{option}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div>
              <button 
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className={`py-2 px-4 rounded mr-2 ${currentQuestion === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Previous
              </button>
              <button 
                onClick={goToNextQuestion}
                disabled={currentQuestion === quiz.questions.length - 1}
                className={`py-2 px-4 rounded ${currentQuestion === quiz.questions.length - 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Next
              </button>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className={`py-2 px-6 rounded ${submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : hasAnsweredAll() 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
              {submitting ? 'Submitting...' : hasAnsweredAll() ? 'Submit Quiz' : 'Submit Partial Quiz'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer
                  ${currentQuestion === index ? 'bg-purple-600 text-white' : 
                    selectedAnswers[index] !== -1 ? 'bg-green-100 border border-green-600 text-green-800' : 
                    'bg-gray-100 border border-gray-300'}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;