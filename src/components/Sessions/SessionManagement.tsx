import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Edit, Trash2, Check, X, Search } from 'lucide-react';
import { mockSessions } from '../../data/mockData';
import { Session } from '../../types';

const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState(mockSessions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSession, setNewSession] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      setSessions(prev => prev.map(session => 
        session.id === editingSession.id 
          ? { 
              ...session, 
              name: newSession.name,
              startDate: new Date(newSession.startDate),
              endDate: new Date(newSession.endDate)
            }
          : session
      ));
      setEditingSession(null);
    } else {
      const session: Session = {
        id: Date.now().toString(),
        name: newSession.name,
        startDate: new Date(newSession.startDate),
        endDate: new Date(newSession.endDate),
        isActive: false,
        createdAt: new Date()
      };
      setSessions(prev => [...prev, session]);
    }
    setNewSession({ name: '', startDate: '', endDate: '' });
    setShowAddForm(false);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setNewSession({
      name: session.name,
      startDate: session.startDate.toISOString().split('T')[0],
      endDate: session.endDate.toISOString().split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const handleToggleActive = (sessionId: string) => {
    setSessions(prev => prev.map(session => ({
      ...session,
      isActive: session.id === sessionId ? !session.isActive : false
    })));
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
        <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Session</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Session Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSession ? 'Edit Session' : 'Add New Session'}
          </h3>
          <form onSubmit={handleSubmitSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Name</label>
              <input
                type="text"
                value={newSession.name}
                onChange={(e) => setNewSession(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Academic Year 2024-25"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={newSession.startDate}
                  onChange={(e) => setNewSession(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={newSession.endDate}
                  onChange={(e) => setNewSession(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingSession ? 'Update Session' : 'Add Session'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingSession(null);
                  setNewSession({ name: '', startDate: '', endDate: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <motion.div
            key={session.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {session.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>End: {session.endDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {session.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleActive(session.id)}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                  session.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {session.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{session.isActive ? 'Deactivate' : 'Activate'}</span>
              </button>
              <button
                onClick={() => handleEditSession(session)}
                className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionManagement;