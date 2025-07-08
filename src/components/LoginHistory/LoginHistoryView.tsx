import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Monitor, Search, Filter, Download } from 'lucide-react';
import { mockLoginHistory, mockUsers } from '../../data/mockData';
import { LoginHistory } from '../../types';

const LoginHistoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const getFilteredHistory = () => {
    let filtered = mockLoginHistory;

    // Apply date filter
    const now = new Date();
    switch (filter) {
      case 'today':
        filtered = filtered.filter(h => 
          h.loginTime.toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(h => h.loginTime >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(h => h.loginTime >= monthAgo);
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(h => {
        const user = mockUsers.find(u => u.id === h.userId);
        return user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               h.ipAddress.includes(searchTerm) ||
               h.location?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered.sort((a, b) => b.loginTime.getTime() - a.loginTime.getTime());
  };

  const filteredHistory = getFilteredHistory();

  const getUserInfo = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getSessionDuration = (history: LoginHistory) => {
    if (!history.logoutTime) return 'Active';
    const duration = history.logoutTime.getTime() - history.loginTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
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

  const stats = {
    totalLogins: filteredHistory.length,
    activeUsers: filteredHistory.filter(h => !h.logoutTime).length,
    uniqueUsers: new Set(filteredHistory.map(h => h.userId)).size,
    avgSessionTime: filteredHistory
      .filter(h => h.logoutTime)
      .reduce((acc, h) => acc + (h.logoutTime!.getTime() - h.loginTime.getTime()), 0) / 
      filteredHistory.filter(h => h.logoutTime).length / (1000 * 60 * 60) || 0
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Login History</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Logins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLogins}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <Monitor className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Users</p>
              <p className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Session</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgSessionTime.toFixed(1)}h</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, IP, or location..."
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
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Login History Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((history) => {
                const user = getUserInfo(history.userId);
                return (
                  <tr key={history.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.loginTime.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.logoutTime ? history.logoutTime.toLocaleString() : 
                        <span className="text-green-600 font-medium">Active</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getSessionDuration(history)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {history.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBrowserInfo(history.userAgent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.location || 'Unknown'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginHistoryView;