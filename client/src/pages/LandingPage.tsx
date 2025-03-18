// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">QuizMaster</h1>
          <nav>
            {!isAuthenticated ? (
              <div className="space-x-4">
                <Link to="/login" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-white text-purple-700 rounded hover:bg-gray-100">
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link 
                to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} 
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Welcome to QuizMaster</h2>
          <p className="text-xl mb-8">
            Create, share, and take quizzes with ease. Perfect for teachers and students.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">For Teachers</h3>
              <p className="mb-6">Create custom quizzes, track student progress, and analyze results.</p>
              <Link 
                to={isAuthenticated && user?.role === 'teacher' ? '/teacher/dashboard' : '/signup'} 
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
              >
                {isAuthenticated && user?.role === 'teacher' ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">For Students</h3>
              <p className="mb-6">Take quizzes, see instant results, and track your learning progress.</p>
              <Link 
                to={isAuthenticated && user?.role === 'student' ? '/student/dashboard' : '/signup'} 
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
              >
                {isAuthenticated && user?.role === 'student' ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;