import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, ArrowLeft, Upload, User, Mail, Phone, Calendar, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StaffSignupProps {
  onBack: () => void;
  onSuccess: () => void;
}

const StaffSignup: React.FC<StaffSignupProps> = ({ onBack, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    dob: '',
    age: '',
    email: '',
    phone: '',
    
    // Professional Information
    experience: '',
    qualification: '',
    facultyId: '',
    subjects: [] as string[],
    
    // Account Information
    password: '',
    confirmPassword: '',
    profilePic: null as File | null
  });

  const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'English',
    'Tamil',
    'Engineering Graphics',
    'Engineering Physics',
    'Engineering Chemistry'
  ];

  // Email validation function - updated to require gmail.com domain
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'dob') {
      // Calculate age when DOB changes
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData(prev => ({ ...prev, [name]: value, age: (age - 1).toString() }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value, age: age.toString() }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.dob && formData.age && 
               formData.email && formData.phone && 
               isValidEmail(formData.email) && isValidPhone(formData.phone);
      case 2:
        return formData.experience && formData.qualification && 
               formData.facultyId && formData.subjects.length > 0;
      case 3:
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.password.length >= 6;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      let errorMessage = 'Please fill in all required fields correctly';
      
      if (currentStep === 1) {
        if (!isValidEmail(formData.email)) {
          errorMessage = 'Please enter a valid email address ending with @gmail.com';
        } else if (!isValidPhone(formData.phone)) {
          errorMessage = 'Please enter a valid 10-digit phone number';
        }
      } else if (currentStep === 3) {
        if (formData.password.length < 6) {
          errorMessage = 'Password must be at least 6 characters long';
        } else if (formData.password !== formData.confirmPassword) {
          errorMessage = 'Passwords do not match';
        }
      }
      
      setError(errorMessage);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setError('Please complete all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address ending with @gmail.com');
      return;
    }

    if (parseInt(formData.age) < 20 || parseInt(formData.age) > 100) {
      setError('Age must be between 20 and 100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'staff'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            role: 'staff'
          });

        if (userError) throw userError;

        // Insert staff record
        const { error: staffError } = await supabase
          .from('staff')
          .insert({
            id: authData.user.id,
            staff_id: formData.facultyId,
            department: 'General',
            designation: 'Faculty',
            phone: formData.phone,
            qualification: formData.qualification,
            experience: parseInt(formData.experience)
          });

        if (staffError) throw staffError;

        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="20"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.email && !isValidEmail(formData.email) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="example@gmail.com"
                  required
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address ending with @gmail.com</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.phone && !isValidPhone(formData.phone) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  required
                />
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Faculty ID *</label>
                <input
                  type="text"
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., FAC001"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., M.Tech Computer Science, Ph.D Mathematics"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects * (Select at least one)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {subjectOptions.map((subject) => (
                    <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => handleSubjectChange(subject)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {formData.subjects.length} subject(s)
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Setup
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {formData.profilePic ? (
                    <img
                      src={URL.createObjectURL(formData.profilePic)}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    formData.password && formData.password.length < 6 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Minimum 6 characters"
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
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters long</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Registration Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Faculty ID:</strong> {formData.facultyId}</p>
                <p><strong>Experience:</strong> {formData.experience} years</p>
                <p><strong>Subjects:</strong> {formData.subjects.join(', ')}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Registration</h1>
            <p className="text-gray-500">Create your faculty account</p>
            <p className="text-sm text-green-600 mt-2">Note: Please use an email address ending with @gmail.com</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {error && (
              <div className="mt-4 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={currentStep === 1 ? onBack : prevStep}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{currentStep === 1 ? 'Back to Login' : 'Previous'}</span>
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffSignup;