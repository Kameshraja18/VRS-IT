import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Users, UserCheck, BookOpen, TrendingUp, Calendar, Award, Bell, MessageSquare, Plus, UserPlus, GraduationCap, AlertTriangle } from 'lucide-react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import AnimatedCard from '../Common/AnimatedCard';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface EnhancedAdminDashboardProps {
  onQuickAction?: (action: string) => void;
}

const EnhancedAdminDashboard: React.FC<EnhancedAdminDashboardProps> = ({ onQuickAction }) => {
  const { loading, error, getUsers, getStudents, getStaff, getNotifications } = useSupabaseData();
  const statsRef = useRef<HTMLDivElement>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalCourses: 2,
    averagePerformance: 87
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    // Animate stats on load with error handling
    if (statsRef.current && !loading) {
      try {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        if (statCards.length > 0) {
          gsap.fromTo(statCards,
            { opacity: 0, y: 50, scale: 0.8 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.7)"
            }
          );
        }
      } catch (animationError) {
        console.warn('Animation error:', animationError);
      }
    }
  }, [loading, dashboardData]);

  const loadDashboardData = async () => {
    try {
      const [studentsData, staffData] = await Promise.all([
        getStudents().catch(() => []),
        getStaff().catch(() => [])
      ]);
      
      setDashboardData({
        totalStudents: studentsData?.length || 0,
        totalStaff: staffData?.length || 0,
        totalCourses: 2,
        averagePerformance: 87
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const stats = [
    { 
      id: 1, 
      name: 'Total Students', 
      value: dashboardData.totalStudents, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      change: '+12%' 
    },
    { 
      id: 2, 
      name: 'Total Staff', 
      value: dashboardData.totalStaff, 
      icon: UserCheck, 
      color: 'from-green-500 to-green-600', 
      change: '+5%' 
    },
    { 
      id: 3, 
      name: 'Active Courses', 
      value: dashboardData.totalCourses, 
      icon: BookOpen, 
      color: 'from-purple-500 to-purple-600', 
      change: '+2%' 
    },
    { 
      id: 4, 
      name: 'Average Performance', 
      value: `${dashboardData.averagePerformance}%`, 
      icon: TrendingUp, 
      color: 'from-orange-500 to-orange-600', 
      change: '+3%' 
    },
  ];

  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Enrollments',
        data: [120, 190, 150, 250, 220, 180],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const performanceData = {
    labels: ['Computer Science', 'Information Technology'],
    datasets: [
      {
        label: 'Average Marks',
        data: [85, 82],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const skillsData = {
    labels: ['Programming', 'Mathematics', 'Communication', 'Problem Solving', 'Teamwork', 'Leadership'],
    datasets: [
      {
        label: 'Student Skills Assessment',
        data: [85, 78, 82, 88, 75, 70],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const handleQuickAction = (action: string) => {
    try {
      switch (action) {
        case 'add-student':
          setShowAddStudentModal(true);
          break;
        case 'add-staff':
          setShowAddStaffModal(true);
          break;
        case 'add-subject':
          setShowAddSubjectModal(true);
          break;
        default:
          if (onQuickAction) {
            onQuickAction(action);
          }
      }
    } catch (err) {
      console.error('Error handling quick action:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">Unable to load dashboard data</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VRS-IT Admin Dashboard
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <AnimatedCard key={stat.id} className="stat-card">
              <motion.div
                variants={itemVariants}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.name}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-white/80 text-xs mt-1">{stat.change} from last month</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
              <div className="h-64">
                <Line data={enrollmentData} options={chartOptions} />
              </div>
            </motion.div>
          </AnimatedCard>

          {/* Department Performance */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
              <div className="h-64">
                <Bar data={performanceData} options={chartOptions} />
              </div>
            </motion.div>
          </AnimatedCard>

          {/* Attendance Overview */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
              <div className="h-64">
                <Doughnut
                  data={attendanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          </AnimatedCard>

          {/* Skills Assessment Radar */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Skills Assessment</h3>
              <div className="h-64">
                <Radar data={skillsData} options={radarOptions} />
              </div>
            </motion.div>
          </AnimatedCard>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuickAction('add-student')}
                  className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Student</span>
                </button>
                <button
                  onClick={() => handleQuickAction('add-staff')}
                  className="bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2"
                >
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Staff</span>
                </button>
                <button
                  onClick={() => handleQuickAction('add-subject')}
                  className="bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-sm font-medium">Create Subject</span>
                </button>
                <button
                  onClick={() => handleQuickAction('send-notice')}
                  className="bg-orange-500 text-white p-4 rounded-xl hover:bg-orange-600 hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2"
                >
                  <Bell className="w-6 h-6" />
                  <span className="text-sm font-medium">Send Notice</span>
                </button>
              </div>
            </motion.div>
          </AnimatedCard>

          {/* Recent Activities */}
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {[
                  { icon: Users, text: 'New student enrolled: Karthik Raj', time: '2 hours ago', color: 'text-blue-600' },
                  { icon: Award, text: 'Results published for CSE Semester 3', time: '4 hours ago', color: 'text-green-600' },
                  { icon: MessageSquare, text: 'New feedback received from students', time: '6 hours ago', color: 'text-purple-600' },
                  { icon: BookOpen, text: 'New subject "AI & ML" added', time: '1 day ago', color: 'text-orange-600' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                    <div className={`w-8 h-8 ${activity.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatedCard>
        </div>
      </motion.div>

      {/* Modals for Quick Actions */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Student Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  window.location.href = '/student-signup';
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Student Self Registration
              </button>
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  // Navigate to admin student entry
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Admin Manual Entry
              </button>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Staff Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddStaffModal(false);
                  window.location.href = '/staff-signup';
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Staff Self Registration
              </button>
              <button
                onClick={() => {
                  setShowAddStaffModal(false);
                  // Navigate to admin staff entry
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Manual Entry
              </button>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Subject</h3>
            <p className="text-gray-600 mb-4">This will redirect you to the Subject Management page where you can create new subjects.</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  // This would be handled by parent component to change tab
                  if (onQuickAction) {
                    onQuickAction('subjects');
                  }
                }}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Subject Management
              </button>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminDashboard;