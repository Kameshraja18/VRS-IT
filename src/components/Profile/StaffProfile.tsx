import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Edit, Save, X, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StaffProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1234567893',
    dateOfBirth: '1985-03-15',
    age: '39',
    staffId: 'STF001',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: 'M.Tech Computer Science, Ph.D (Pursuing)',
    experience: '8',
    joinDate: '2020-08-15',
    salary: '75000',
    subjects: ['Data Structures', 'Algorithms', 'Database Management', 'Software Engineering'],
    address: '456 Faculty Colony, College City',
    emergencyContact: '+1234567894',
    specialization: 'Machine Learning, Data Science',
    publications: '15',
    researchProjects: '3'
  });

  const handleSave = () => {
    // Here you would typically save to the database
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset to original data
    setEditedData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1234567893',
      dateOfBirth: '1985-03-15',
      age: '39',
      staffId: 'STF001',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'M.Tech Computer Science, Ph.D (Pursuing)',
      experience: '8',
      joinDate: '2020-08-15',
      salary: '75000',
      subjects: ['Data Structures', 'Algorithms', 'Database Management', 'Software Engineering'],
      address: '456 Faculty Colony, College City',
      emergencyContact: '+1234567894',
      specialization: 'Machine Learning, Data Science',
      publications: '15',
      researchProjects: '3'
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
        <h1 className="text-2xl font-bold text-gray-900">Staff Profile</h1>
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
              src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{editedData.name}</h2>
            <p className="text-gray-600">{editedData.staffId} • {editedData.designation}</p>
            <p className="text-gray-500">{editedData.department} Department</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{editedData.experience} Years Experience</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-gray-900">{editedData.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                <p className="text-gray-900">{editedData.staffId}</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.emergencyContact}
                  onChange={(e) => setEditedData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedData.emergencyContact}</p>
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

        {/* Professional Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Professional Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p className="text-gray-900">{editedData.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <p className="text-gray-900">{editedData.designation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(editedData.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <p className="text-gray-900">{editedData.experience} years</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              {isEditing ? (
                <textarea
                  value={editedData.qualification}
                  onChange={(e) => setEditedData(prev => ({ ...prev, qualification: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedData.qualification}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.specialization}
                  onChange={(e) => setEditedData(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{editedData.specialization}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Teaching Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Teaching Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Teaching</label>
              <div className="flex flex-wrap gap-2">
                {editedData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Research & Publications */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Research & Publications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{editedData.publications}</div>
              <div className="text-sm text-gray-600">Publications</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{editedData.researchProjects}</div>
              <div className="text-sm text-gray-600">Research Projects</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{editedData.experience}</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StaffProfile;