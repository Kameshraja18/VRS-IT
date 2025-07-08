import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Calendar, Upload, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedCard from '../Common/AnimatedCard';

interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  submissionType: 'online' | 'offline' | 'both';
  status: 'active' | 'closed' | 'draft';
  submissions: number;
  totalStudents: number;
}

const AssessmentManagement: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Data Structures Assignment',
      description: 'Implement Binary Search Tree with all operations',
      subject: 'Data Structures',
      dueDate: new Date('2024-12-15'),
      maxMarks: 50,
      submissionType: 'online',
      status: 'active',
      submissions: 25,
      totalStudents: 30
    },
    {
      id: '2',
      title: 'Database Design Project',
      description: 'Design and implement a complete database system',
      subject: 'Database Management',
      dueDate: new Date('2024-12-20'),
      maxMarks: 100,
      submissionType: 'both',
      status: 'active',
      submissions: 18,
      totalStudents: 30
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    maxMarks: 50,
    submissionType: 'online' as 'online' | 'offline' | 'both'
  });

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const assessment: Assessment = {
      id: Date.now().toString(),
      title: newAssessment.title,
      description: newAssessment.description,
      subject: newAssessment.subject,
      dueDate: new Date(newAssessment.dueDate),
      maxMarks: newAssessment.maxMarks,
      submissionType: newAssessment.submissionType,
      status: 'active',
      submissions: 0,
      totalStudents: 30
    };
    
    setAssessments(prev => [...prev, assessment]);
    setNewAssessment({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      maxMarks: 50,
      submissionType: 'online'
    });
    setShowCreateForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-purple-100 text-purple-800';
      case 'both': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
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
        <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {assessments.filter(a => a.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {assessments.filter(a => isOverdue(a.dueDate) && a.status === 'active').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Submissions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(assessments.reduce((acc, a) => acc + (a.submissions / a.totalStudents * 100), 0) / assessments.length)}%
                </p>
              </div>
              <Upload className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Create Assessment Form */}
      {showCreateForm && (
        <AnimatedCard>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Assessment</h3>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={newAssessment.subject}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newAssessment.dueDate}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={newAssessment.maxMarks}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, maxMarks: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submission Type</label>
                  <select
                    value={newAssessment.submissionType}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, submissionType: e.target.value as 'online' | 'offline' | 'both' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="online">Online Only</option>
                    <option value="offline">Offline Only</option>
                    <option value="both">Both Online & Offline</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of the assessment..."
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assessment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </AnimatedCard>
      )}

      {/* Assessments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assessments.map((assessment, index) => (
          <AnimatedCard key={assessment.id} delay={index * 0.1}>
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSubmissionTypeColor(assessment.submissionType)}`}>
                      {assessment.submissionType}
                    </span>
                    {isOverdue(assessment.dueDate) && assessment.status === 'active' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{assessment.maxMarks}</p>
                  <p className="text-xs text-gray-500">Max Marks</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subject:</span>
                  <span className="font-medium">{assessment.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Due Date:</span>
                  <span className={`font-medium ${isOverdue(assessment.dueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {assessment.dueDate.toLocaleDateString()} {assessment.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Submissions:</span>
                  <span className="font-medium">
                    {assessment.submissions}/{assessment.totalStudents} ({Math.round((assessment.submissions / assessment.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <button className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatedCard>
        ))}
      </div>
    </motion.div>
  );
};

export default AssessmentManagement;