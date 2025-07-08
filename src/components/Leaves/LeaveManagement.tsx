import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, X, Plus, Search, Filter } from 'lucide-react';
import { mockLeaves } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Leave } from '../../types';

const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState(mockLeaves);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newLeave, setNewLeave] = useState({
    leaveType: 'sick' as Leave['leaveType'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const filteredLeaves = leaves.filter(leave => {
    const matchesFilter = filter === 'all' || leave.status === filter;
    const matchesSearch = leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = user?.role === 'admin' || leave.userId === user?.id;
    return matchesFilter && matchesSearch && matchesUser;
  });

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const leave: Leave = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userType: user?.role === 'staff' ? 'staff' : 'student',
      leaveType: newLeave.leaveType,
      startDate: new Date(newLeave.startDate),
      endDate: new Date(newLeave.endDate),
      reason: newLeave.reason,
      status: 'pending',
      appliedDate: new Date()
    };
    setLeaves(prev => [...prev, leave]);
    setNewLeave({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });
    setShowAddForm(false);
  };

  const handleLeaveAction = (leaveId: string, action: 'approved' | 'rejected', comments?: string) => {
    setLeaves(prev => prev.map(leave => 
      leave.id === leaveId 
        ? { 
            ...leave, 
            status: action,
            reviewedBy: user?.id,
            reviewDate: new Date(),
            reviewComments: comments
          }
        : leave
    ));
  };

  const getStatusColor = (status: Leave['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
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

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        {user?.role !== 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{leaves.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leaves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Leaves</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leave Application Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for Leave</h3>
          <form onSubmit={handleSubmitLeave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, leaveType: e.target.value as Leave['leaveType'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="vacation">Vacation Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide reason for leave..."
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Leaves List */}
      <div className="space-y-4">
        {filteredLeaves.map((leave) => (
          <motion.div
            key={leave.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {leave.leaveType} Leave
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{leave.reason}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Duration:</span> {leave.startDate.toLocaleDateString()} - {leave.endDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Applied:</span> {leave.appliedDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Days:</span> {Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
                {leave.reviewComments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Review Comments:</span> {leave.reviewComments}
                    </p>
                  </div>
                )}
              </div>
              {user?.role === 'admin' && leave.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleLeaveAction(leave.id, 'approved', 'Leave approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleLeaveAction(leave.id, 'rejected', 'Leave rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeaveManagement;