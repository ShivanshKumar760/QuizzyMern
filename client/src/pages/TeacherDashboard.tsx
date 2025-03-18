// src/pages/TeacherDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Quiz } from '../types';
import Header from '../components/Header';

const TeacherDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        // Filter quizzes created by current teacher
        const teacherQuizzes = response.data.filter(
          (quiz: Quiz) => quiz.createdBy === user?.id
        );
        setQuizzes(teacherQuizzes);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to Fetch Quizzes';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/api/quizzes/${id}`);
        setQuizzes(quizzes.filter(quiz => quiz._id !== id));
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to Delete Quiz';
        setError(errorMessage);
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <Link
            to="/teacher/create-quiz"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-500"
          >
            Create New Quiz
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="mb-4">You haven't created any quizzes yet.</p>
            <Link
              to="/teacher/create-quiz"
              className="text-purple-600 hover:underline"
            >
              Create your first quiz
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <div>Questions: {quiz.questions.length}</div>
                    <div>Time limit: {quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'No limit'}</div>
                    <div>Created: {new Date(quiz.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-between">
                  <div>
                    <Link
                      to={`/teacher/edit-quiz/${quiz._id}`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <Link
                    to={`/teacher/quiz-results/${quiz._id}`}
                    className="text-purple-600 hover:underline"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;