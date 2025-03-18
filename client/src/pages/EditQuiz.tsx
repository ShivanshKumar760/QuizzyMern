import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../services/api';

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  _id?: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  createdBy?: string;
  createdAt?: string;
}

const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    description: '',
    timeLimit: 0,
    questions: []
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/api/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setQuiz(response.data.quiz);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          console.log(error.message);
        }
        setError('Failed to fetch quiz. Please try again.');
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz({ ...quiz, title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, description: e.target.value });
  };

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 });
  };

  const handleQuestionTextChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].text = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (questionIndex: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].correctAnswer = parseInt(e.target.value);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.push('');
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    
    // Update correctAnswer if needed
    if (updatedQuestions[questionIndex].correctAnswer >= updatedQuestions[questionIndex].options.length) {
      updatedQuestions[questionIndex].correctAnswer = 0;
    }
    
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate quiz before submitting
      if (!quiz.title.trim()) {
        setError('Quiz title is required');
        return;
      }

      if (quiz.questions.length === 0) {
        setError('Quiz must have at least one question');
        return;
      }

      for (const question of quiz.questions) {
        if (!question.text.trim()) {
          setError('All questions must have text');
          return;
        }

        if (question.options.length < 2) {
          setError('Each question must have at least two options');
          return;
        }

        for (const option of question.options) {
          if (!option.trim()) {
            setError('All options must have text');
            return;
          }
        }
      }

      await api.put(`/api/quizzes/${id}`, quiz, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/teacher/quizzes');
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.log(error.message);
      }
      setError('Failed to update quiz. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading quiz data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Quiz Title:
          </label>
          <input
            type="text"
            value={quiz.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter quiz title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Description:
          </label>
          <textarea
            value={quiz.description}
            onChange={handleDescriptionChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter quiz description"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Time Limit (minutes, 0 for no limit):
          </label>
          <input
            type="number"
            value={quiz.timeLimit}
            onChange={handleTimeLimitChange}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Questions</h2>
            <button 
              type="button" 
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Question
            </button>
          </div>
          
          {quiz?.questions.length === 0 ? (
            <div className="text-center py-4 border rounded">
              No questions yet. Click "Add Question" to start.
            </div>
          ) : (
            quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Question {qIndex + 1}</h3>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Question Text:</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionTextChange(qIndex, e)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter question text"
                  />
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-gray-700">Options:</label>
                    <button 
                      type="button" 
                      onClick={() => addOption(qIndex)}
                      className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                    >
                      Add Option
                    </button>
                  </div>
                  
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                        className="flex-grow px-3 py-2 border rounded mr-2"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Correct Answer:</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {question.options.map((_, index) => (
                      <option key={index} value={index}>
                        Option {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/teacher/quizzes')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuiz;