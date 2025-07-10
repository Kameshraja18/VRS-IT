import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StudentSignup from './StudentSignup';
import StaffSignup from './StaffSignup';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<'login' | 'student-signup' | 'staff-signup'>('login');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignupSuccess = () => {
    setCurrentView('login');
    setError('');
    alert('Registration successful! Please check your email to verify your account, then login.');
  };

  if (currentView === 'student-signup') {
    return (
      <StudentSignup
        onBack={() => setCurrentView('login')}
        onSuccess={handleSignupSuccess}
      />
    );
  }

  if (currentView === 'staff-signup') {
    return (
      <StaffSignup
        onBack={() => setCurrentView('login')}
        onSuccess={handleSignupSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">VRS-IT</h1>
            <p className="text-gray-500">College Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to VRS-IT?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentView('student-signup')}
                className="flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="text-sm">Student Sign Up</span>
              </button>
              <button
                onClick={() => setCurrentView('staff-signup')}
                className="flex items-center justify-center px-4 py-2 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="text-sm">Staff Sign Up</span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-2">Demo Login Credentials:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin1@gmail.com / admin123</p>
                <p><strong>Staff:</strong> staff1@gmail.com / staff123</p>
                <p><strong>Student:</strong> student1@gmail.com / student123</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;