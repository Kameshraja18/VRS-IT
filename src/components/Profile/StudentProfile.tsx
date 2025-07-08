import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1234567890',
    address: '123 Student St, College City',
    dateOfBirth: '2002-05-15',
    bloodGroup: 'O+',
    parentName: 'Robert Student',
    parentPhone: '+1234567899',
    course: 'Computer Science Engineering',
    year: '2nd',
    semester: '3rd',
    rollNumber: 'BCS2024001',
    registerNumber: 'REG2024001',
    studentId: 'STU001',
    tenthMarks: '85.5',
    twelfthMarks: '92.0',
    engineeringCutoff: '175.5',
    tneaId: 'TNEA2024001',
    emis: 'EMIS001',
    aadhaar: '1234-5678-9012'
  });

  const handleSave = () => {
    // Here you would typically save to the database
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset to original data
    setEditedData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1234567890',
      address: '123 Student St, College City',
      dateOfBirth: '2002-05-15',
      bloodGroup: 'O+',
      parentName: 'Robert Student',
      parentPhone: '+1234567899',
      course: 'Computer Science Engineering',
      year: '2nd',
      semester: '3rd',
      rollNumber: 'BCS2024001',
      registerNumber: 'REG2024001',
      studentId: 'STU001',
      tenthMarks: '85.5',
      twelfthMarks: '92.0',
      engineeringCutoff: '175.5',
      tneaId: 'TNEA2024001',
      emis: 'EMIS001',
      aadhaar: '1234-5678-9012'
    });
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{editedData.name}</h2>
            <p className="text-gray-600">{editedData.studentId} • {editedData.course}</p>
            <p className="text-gray-500">{editedData.year} Year • {editedData.semester} Semester</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Regular Student</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{editedData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.dateOfBirth}
                    onChange={(e) => setEditedData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{new Date(editedData.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                {isEditing ? (
                  <select
                    value={editedData.bloodGroup}
                    onChange={(e) => setEditedData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{editedData.bloodGroup}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                <p className="text-gray-900">{editedData.aadhaar}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {editedData.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {editedData.phone}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={editedData.address}
                  onChange={(e) => setEditedData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1" />
                  {editedData.address}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Academic Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Academic Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <p className="text-gray-900">{editedData.rollNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                <p className="text-gray-900">{editedData.registerNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TNEA ID</label>
                <p className="text-gray-900">{editedData.tneaId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMIS Number</label>
                <p className="text-gray-900">{editedData.emis}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Parent Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Parent Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.parentName}
                  onChange={(e) => setEditedData(prev => ({ ...prev, parentName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedData.parentName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.parentPhone}
                  onChange={(e) => setEditedData(prev => ({ ...prev, parentPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedData.parentPhone}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Academic Performance */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Academic Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">10th Marks (%)</label>
              <p className="text-gray-900 text-lg font-semibold">{editedData.tenthMarks}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">12th Marks (%)</label>
              <p className="text-gray-900 text-lg font-semibold">{editedData.twelfthMarks}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engineering Cutoff</label>
              <p className="text-gray-900 text-lg font-semibold">{editedData.engineeringCutoff}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;