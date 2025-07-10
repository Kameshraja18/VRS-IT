import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, ArrowLeft, Upload, User, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StudentSignupProps {
  onBack: () => void;
  onSuccess: () => void;
}

const StudentSignup: React.FC<StudentSignupProps> = ({ onBack, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    fatherName: '',
    dob: '',
    email: '',
    mobile: '',
    aadhaar: '',
    emis: '',
    bloodGroup: 'O+',
    
    // Address Information
    primaryAddress: '',
    communicationAddress: '',
    
    // Academic Information
    year: '1st',
    tenthMarks: '',
    twelfthMarks: '',
    engineeringCutoff: '',
    tneaId: '',
    rollNumber: '',
    registerNumber: '',
    course: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    profilePic: null as File | null
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const years = ['1st', '2nd', '3rd', '4th'];

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

  // Aadhaar validation function
  const isValidAadhaar = (aadhaar: string) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        return formData.firstName && formData.lastName && formData.fatherName && 
               formData.dob && formData.email && formData.mobile && 
               formData.aadhaar && formData.emis && formData.bloodGroup &&
               isValidEmail(formData.email) && isValidPhone(formData.mobile) && 
               isValidAadhaar(formData.aadhaar);
      case 2:
        return formData.primaryAddress && formData.communicationAddress;
      case 3:
        return formData.year && formData.tenthMarks && formData.twelfthMarks && 
               formData.engineeringCutoff && formData.tneaId && 
               formData.rollNumber && formData.registerNumber && formData.course;
      case 4:
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
        } else if (!isValidPhone(formData.mobile)) {
          errorMessage = 'Please enter a valid 10-digit mobile number';
        } else if (!isValidAadhaar(formData.aadhaar)) {
          errorMessage = 'Please enter a valid 12-digit Aadhaar number';
        }
      } else if (currentStep === 4) {
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
    if (!validateStep(4)) {
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

    setLoading(true);
    setError('');

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: `${formData.firstName} ${formData.lastName}`,
            role: 'student'
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
            name: `${formData.firstName} ${formData.lastName}`,
            role: 'student'
          });

        if (userError) throw userError;

        // Insert student record
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: authData.user.id,
            student_id: formData.registerNumber,
            roll_number: formData.rollNumber,
            phone: formData.mobile,
            address: formData.primaryAddress,
            course_id: formData.course,
            year: parseInt(formData.year.charAt(0)),
            semester: 1,
            parent_name: formData.fatherName,
            parent_phone: formData.mobile,
            date_of_birth: formData.dob,
            blood_group: formData.bloodGroup
          });

        if (studentError) throw studentError;

        // Show success message
        alert('Registration successful! Please check your email to verify your account, then login.');
        onSuccess();
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message?.includes('duplicate key')) {
        setError('This email, roll number, or register number is already taken. Please use different credentials.');
      } else if (err.message?.includes('email')) {
        setError('Please use a valid email address ending with @gmail.com');
      } else {
        setError('Registration failed. Please try again or contact administrator.');
      }
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.mobile && !isValidPhone(formData.mobile) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
                {formData.mobile && !isValidPhone(formData.mobile) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit mobile number</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.aadhaar && !isValidAadhaar(formData.aadhaar) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  required
                />
                {formData.aadhaar && !isValidAadhaar(formData.aadhaar) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid 12-digit Aadhaar number</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EMIS Number *</label>
                <input
                  type="text"
                  name="emis"
                  value={formData.emis}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Address *</label>
              <textarea
                name="primaryAddress"
                value={formData.primaryAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Address *</label>
              <textarea
                name="communicationAddress"
                value={formData.communicationAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAddress"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, communicationAddress: prev.primaryAddress }));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-700">
                Communication address same as primary address
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year} Year</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="1">Computer Science Engineering</option>
                  <option value="2">Information Technology</option>
                  <option value="3">Electronics and Communication</option>
                  <option value="4">Mechanical Engineering</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">10th Marks (%) *</label>
                <input
                  type="number"
                  name="tenthMarks"
                  value={formData.tenthMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">12th Marks (%) *</label>
                <input
                  type="number"
                  name="twelfthMarks"
                  value={formData.twelfthMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engineering Cutoff *</label>
                <input
                  type="number"
                  name="engineeringCutoff"
                  value={formData.engineeringCutoff}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TNEA ID *</label>
                <input
                  type="text"
                  name="tneaId"
                  value={formData.tneaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Register Number *</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Student Registration</h1>
            <p className="text-gray-500">Create your student account</p>
            <p className="text-sm text-blue-600 mt-2">Note: Please use an email address ending with @gmail.com</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
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

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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

export default StudentSignup;