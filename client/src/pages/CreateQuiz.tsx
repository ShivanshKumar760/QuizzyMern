// src/pages/CreateQuiz.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Question } from '../types';
import Header from '../components/Header';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([{ 
    text: '', 
    options: ['', '', '', ''], 
    correctAnswer: 0 
  }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index: number, field: keyof Question, value: string | number) => {
    const updatedQuestions = [...questions];
    
    if (field === 'text') {
      updatedQuestions[index].text = value as string;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = value as number;
    }
    
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const validateQuiz = () => {
    if (!title.trim()) {
      setError('Please enter a quiz title');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.text.trim()) {
        setError(`Question ${i + 1} text is empty`);
        return false;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          setError(`Option ${j + 1} in Question ${i + 1} is empty`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.post('/api/quizzes', {
        title,
        description,
        questions,
        timeLimit: parseInt(timeLimit.toString())
      });
      
      navigate('/teacher/dashboard');
    }catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to Create quiz';
        setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Quiz Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 mb-2" htmlFor="timeLimit">
              Time Limit (minutes, 0 for no limit)
            </label>
            <input
              id="timeLimit"
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-8 p-4 border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Question
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor={`question-${qIndex}`}>
                  Question Text
                </label>
                <textarea
                  id={`question-${qIndex}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Options</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`question-${qIndex}-correct-${oIndex}`}
                      name={`question-${qIndex}-correct`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-600">
                Select the radio button next to the correct answer.
              </div>
            </div>
          ))}
          
          <div className="mb-6">
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Add Question
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={loading}
            >
              {loading ? 'Creating Quiz...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;