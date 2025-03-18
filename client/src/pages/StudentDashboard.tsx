// src/pages/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Quiz, QuizResult } from '../types';
import Header from '../components/Header';

const StudentDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
//   const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, resultsResponse] = await Promise.all([
          api.get('/api/quizzes'),
          api.get('/api/results/me')
        ]);
        
        setQuizzes(quizzesResponse.data);
        setResults(resultsResponse.data);
      }catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to Fetch Data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter out quizzes the student has already taken
  const availableQuizzes = quizzes.filter(quiz => 
    !results.some(result => result.quizId === quiz._id)
  );

  // Helper to get quiz title from ID
//   const getQuizTitle = (quizId: string) => {
//     const quiz = quizzes.find(q => q._id === quizId);
//     return quiz ? quiz.title : 'Unknown Quiz';
//   };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
              
              {availableQuizzes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p>No quizzes available right now.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableQuizzes.map((quiz) => (
                    <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                        <p className="text-gray-600 mb-4">{quiz.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          <div>Questions: {quiz.questions.length}</div>
                          <div>Time limit: {quiz.timeLimit > 0 ? `${quiz.timeLimit} minutes` : 'No limit'}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-6 py-3">
                        <Link
                          to={`/student/take-quiz/${quiz._id}`}
                          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-500 inline-block"
                        >
                          Take Quiz
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Your Quiz Results</h2>
              
              {results.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p>You haven't taken any quizzes yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left">Quiz</th>
                        <th className="py-3 px-4 text-left">Score</th>
                        <th className="py-3 px-4 text-left">Percentage</th>
                        <th className="py-3 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result._id} className="border-t border-gray-200">
                          <td className="py-3 px-4">{result.quizTitle}</td>
                          <td className="py-3 px-4">{result.score}/{result.totalQuestions}</td>
                          <td className="py-3 px-4">{result.percentage.toFixed(1)}%</td>
                          <td className="py-3 px-4">{new Date(result.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;