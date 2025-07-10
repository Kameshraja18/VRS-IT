import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload, UserCheck, Phone, Mail, Award, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface StaffMember {
  id: string;
  staff_id: string;
  department: string;
  designation: string;
  phone?: string;
  qualification?: string;
  experience?: number;
  join_date: string;
  salary?: number;
  users: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const StaffManagement: React.FC = () => {
  const { user } = useAuth();
  const { loading, getStaff, createStaff, updateStaff } = useSupabaseData();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    staffId: '',
    department: '',
    designation: '',
    phone: '',
    qualification: '',
    experience: 0,
    salary: 0
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const staffData = await getStaff();
    setStaff(staffData || []);
  };

  const canManageStaff = user?.role === 'admin';

  if (!canManageStaff) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators can manage staff.</p>
      </div>
    );
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.users.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || member.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(staff.map(s => s.department))];

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStaff) {
        // Update existing staff
        await updateStaff(editingStaff.id, {
          staff_id: newStaff.staffId,
          department: newStaff.department,
          designation: newStaff.designation,
          phone: newStaff.phone,
          qualification: newStaff.qualification,
          experience: newStaff.experience,
          salary: newStaff.salary
        });
      } else {
        // Create new staff (this would require creating user first)
        alert('Please use the staff signup form to add new staff members.');
        return;
      }
      
      await loadStaff();
      setNewStaff({
        name: '',
        email: '',
        staffId: '',
        department: '',
        designation: '',
        phone: '',
        qualification: '',
        experience: 0,
        salary: 0
      });
      setShowAddForm(false);
      setEditingStaff(null);
    } catch (error) {
      console.error('Error managing staff:', error);
      alert('Error managing staff. Please try again.');
    }
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setNewStaff({
      name: staffMember.users.name,
      email: staffMember.users.email,
      staffId: staffMember.staff_id,
      department: staffMember.department,
      designation: staffMember.designation,
      phone: staffMember.phone || '',
      qualification: staffMember.qualification || '',
      experience: staffMember.experience || 0,
      salary: staffMember.salary || 0
    });
    setShowAddForm(true);
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
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Staff Management
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.href = '/staff-signup'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Departments</p>
                <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Experience</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(staff.reduce((acc, s) => acc + (s.experience || 0), 0) / staff.length || 0)} yrs
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">{staff.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Filters */}
      <AnimatedCard>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredStaff.length} staff members found
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Edit Staff Form */}
      {showAddForm && (
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <form onSubmit={handleSubmitStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingStaff}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingStaff}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
                  <input
                    type="text"
                    value={newStaff.staffId}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, staffId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Communication">Electronics and Communication</option>
                    <option value="Electrical and Electronics">Electrical and Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Science and Humanities">Science and Humanities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <select
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={newStaff.experience}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                  <input
                    type="number"
                    min="0"
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <textarea
                  value={newStaff.qualification}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, qualification: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Educational qualifications..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStaff(null);
                    setNewStaff({
                      name: '',
                      email: '',
                      staffId: '',
                      department: '',
                      designation: '',
                      phone: '',
                      qualification: '',
                      experience: 0,
                      salary: 0
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </AnimatedCard>
      )}

      {/* Staff Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, index) => (
            <AnimatedCard key={member.id} delay={index * 0.1}>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={member.users.avatar || `https://images.pexels.com/photos/${774909 + index}/pexels-photo-${774909 + index}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                      alt={member.users.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-green-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.users.name}</h3>
                    <p className="text-sm text-gray-500">{member.staff_id}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{member.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Designation:</span>
                    <span className="font-medium">{member.designation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span className="font-medium">{member.experience || 0} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Join Date:</span>
                    <span className="font-medium">{new Date(member.join_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedStaff(member)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditStaff(member)}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <AnimatedCard>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Staff Details</h2>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStaff.users.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedStaff.users.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStaff.users.name}</h3>
                    <p className="text-gray-600">{selectedStaff.users.email}</p>
                    <p className="text-gray-600">{selectedStaff.staff_id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-gray-900">{selectedStaff.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <p className="text-gray-900">{selectedStaff.designation}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedStaff.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{selectedStaff.experience || 0} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="text-gray-900">{new Date(selectedStaff.join_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <p className="text-gray-900">₹{selectedStaff.salary?.toLocaleString() || 'Not disclosed'}</p>
                  </div>
                </div>
                
                {selectedStaff.qualification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification</label>
                    <p className="text-gray-900">{selectedStaff.qualification}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatedCard>
        </div>
      )}
    </motion.div>
  );
};

export default StaffManagement;