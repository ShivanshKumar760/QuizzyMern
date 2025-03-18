// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import TakeQuiz from './pages/TakeQuiz';
// import QuizResults from './pages/QuizResults';
// import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Teacher Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/create-quiz" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateQuiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/edit-quiz/:id" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <EditQuiz />
              </ProtectedRoute>
            } 
          />
         
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/take-quiz/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <TakeQuiz />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;