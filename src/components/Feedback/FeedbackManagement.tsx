import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Reply, Search, Filter, Plus } from 'lucide-react';
import { mockFeedbacks } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Feedback } from '../../types';

const FeedbackManagement: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newFeedback, setNewFeedback] = useState({
    subject: '',
    message: ''
  });

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = filter === 'all' || feedback.status === filter;
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = user?.role === 'admin' || feedback.fromUserId === user?.id;
    return matchesFilter && matchesSearch && matchesUser;
  });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: Feedback = {
      id: Date.now().toString(),
      fromUserId: user?.id || '1',
      fromUserType: user?.role === 'staff' ? 'staff' : 'student',
      toUserId: '1', // Admin
      subject: newFeedback.subject,
      message: newFeedback.message,
      status: 'pending',
      createdAt: new Date()
    };
    setFeedbacks(prev => [...prev, feedback]);
    setNewFeedback({ subject: '', message: '' });
    setShowAddForm(false);
  };

  const handleReply = (feedbackId: string) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            status: 'replied',
            reply: replyText,
            repliedAt: new Date(),
            repliedBy: user?.id
          }
        : feedback
    ));
    setReplyingTo(null);
    setReplyText('');
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
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

  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
  const reviewedCount = feedbacks.filter(f => f.status === 'reviewed').length;
  const repliedCount = feedbacks.filter(f => f.status === 'replied').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
        {user?.role !== 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Send Feedback</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reviewed</p>
              <p className="text-2xl font-bold text-blue-600">{reviewedCount}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-2xl font-bold text-green-600">{repliedCount}</p>
            </div>
            <Reply className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
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
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Feedback Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Feedback</h3>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={newFeedback.subject}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feedback subject..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={newFeedback.message}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your feedback message..."
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Feedback</span>
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

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{feedback.subject}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{feedback.message}</p>
                <p className="text-sm text-gray-500">
                  Submitted on {feedback.createdAt.toLocaleDateString()} by {feedback.fromUserType}
                </p>
              </div>
              {user?.role === 'admin' && feedback.status !== 'replied' && (
                <button
                  onClick={() => setReplyingTo(feedback.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {feedback.reply && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Reply className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Admin Reply</span>
                  <span className="text-xs text-blue-600">
                    {feedback.repliedAt?.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-blue-800">{feedback.reply}</p>
              </div>
            )}

            {replyingTo === feedback.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Reply to Feedback</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  placeholder="Enter your reply..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReply(feedback.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeedbackManagement;