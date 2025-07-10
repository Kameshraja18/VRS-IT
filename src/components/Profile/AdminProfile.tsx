import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, Shield, Edit, Save, X, Settings, Key, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedCard from '../Common/AnimatedCard';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91-4146-123456',
    address: 'VRS College of Engineering & Technology, Arasur-607 107, Villupuram District',
    dateOfBirth: '1975-08-15',
    employeeId: 'ADMIN001',
    designation: 'Principal',
    department: 'Administration',
    joinDate: '2020-01-15',
    qualification: 'Ph.D in Computer Science, M.Tech, B.Tech',
    experience: '25',
    specialization: 'Educational Administration, Computer Science',
    emergencyContact: '+91-4146-123457',
    bloodGroup: 'B+',
    permissions: ['Full System Access', 'User Management', 'Academic Management', 'Financial Management', 'Reports & Analytics']
  });

  const handleSave = () => {
    // Here you would typically save to the database
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset to original data
    setEditedData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+91-4146-123456',
      address: 'VRS College of Engineering & Technology, Arasur-607 107, Villupuram District',
      dateOfBirth: '1975-08-15',
      employeeId: 'ADMIN001',
      designation: 'Principal',
      department: 'Administration',
      joinDate: '2020-01-15',
      qualification: 'Ph.D in Computer Science, M.Tech, B.Tech',
      experience: '25',
      specialization: 'Educational Administration, Computer Science',
      emergencyContact: '+91-4146-123457',
      bloodGroup: 'B+',
      permissions: ['Full System Access', 'User Management', 'Academic Management', 'Financial Management', 'Reports & Analytics']
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
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Administrator Profile
        </h1>
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
      <AnimatedCard>
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{editedData.name}</h2>
              <p className="text-blue-100 text-lg mb-1">{editedData.employeeId} • {editedData.designation}</p>
              <p className="text-blue-200">{editedData.department}</p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">Joined {new Date(editedData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">{editedData.experience} Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatedCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <AnimatedCard>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <p className="text-gray-900">{editedData.employeeId}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatedCard>

        {/* Contact Information */}
        <AnimatedCard>
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
        </AnimatedCard>

        {/* Professional Information */}
        <AnimatedCard>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
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
        </AnimatedCard>

        {/* System Permissions */}
        <AnimatedCard>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              System Permissions
            </h3>
            <div className="space-y-3">
              {editedData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-green-800 font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard>
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Key className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-blue-900">Change Password</p>
                  <p className="text-sm text-blue-600">Update your login password</p>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Bell className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-900">Notification Settings</p>
                  <p className="text-sm text-green-600">Manage your notifications</p>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Settings className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-purple-900">System Settings</p>
                  <p className="text-sm text-purple-600">Configure system preferences</p>
                </div>
              </button>
            </div>
          </motion.div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

export default AdminProfile;