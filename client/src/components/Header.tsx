// import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  logo?: string;
  navItems?: NavItem[];
}

const Header: React.FC<HeaderProps> = (
) => {
      const { isAuthenticated, user } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

 

  return (
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
  );
};

export default Header;