import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Home, 
  Users, 
  UserCheck, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  GraduationCap,
  ClipboardList,
  Calendar,
  MessageCircle,
  Bell,
  FileText,
  Award,
  Clock,
  Send,
  Shield,
  Eye,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { animateNavigation } from '../../lib/gsapAnimations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      animateNavigation();
    }
  }, [isOpen]);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'all' },
    ];

    const menuItems = [
      ...baseItems,
      // Admin only items
      { id: 'students', label: 'Students Management', icon: Users, permission: 'admin,staff' },
      { id: 'staff', label: 'Staff Management', icon: UserCheck, permission: 'admin' },
      { id: 'courses', label: 'Courses', icon: GraduationCap, permission: 'admin' },
      { id: 'sessions', label: 'Sessions', icon: Calendar, permission: 'admin' },
      { id: 'result-declaration', label: 'Declare Results', icon: Send, permission: 'admin' },
      { id: 'login-history', label: 'Login History', icon: Eye, permission: 'admin' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'admin' },
      
      // Staff and Admin items
      { id: 'attendance', label: 'Attendance', icon: ClipboardList, permission: 'admin,staff,student' },
      { id: 'marks', label: user?.role === 'student' ? 'My Results' : 'Marks Management', icon: Award, permission: 'admin,staff,student' },
      
      // All users items
      { id: 'subjects', label: user?.role === 'student' ? 'My Subjects' : 'Subject Management', icon: BookOpen, permission: 'all' },
      { id: 'assessments', label: 'Assessments', icon: FileCheck, permission: 'all' },
      { id: 'leaves', label: 'Leave Management', icon: Clock, permission: 'all' },
      { id: 'feedback', label: 'Feedback', icon: MessageCircle, permission: 'all' },
      { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'all' },
      
      // Student specific
      { id: 'marksheet', label: 'Download Marksheet', icon: FileText, permission: 'student' },
      { id: 'profile', label: 'My Profile', icon: Users, permission: 'student,staff' },
      
      // Settings
      { id: 'settings', label: 'Settings', icon: Settings, permission: 'admin' },
    ];

    // Filter based on user role
    return menuItems.filter(item => {
      if (item.permission === 'all') return true;
      return item.permission.includes(user?.role || '');
    });
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl shadow-2xl z-50 lg:relative lg:translate-x-0 lg:shadow-none overflow-y-auto border-r border-white/20"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VRS-IT
                </h1>
                <p className="text-sm text-gray-500">College System</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                />
                {user?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`nav-item w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  activeTab === item.id ? 'text-white' : 'text-gray-500'
                }`} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={logout}
              className="nav-item w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;