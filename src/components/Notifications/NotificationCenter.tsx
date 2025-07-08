import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { Notification } from '../../types';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <Check className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <Bell className={`${iconClass} text-yellow-600`} />;
      case 'error':
        return <Bell className={`${iconClass} text-red-600`} />;
      default:
        return <Bell className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">{unreadCount} unread notifications</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : `${getNotificationBg(notification.type)} border-l-4`
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {notification.actionUrl && (
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium">
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCenter;