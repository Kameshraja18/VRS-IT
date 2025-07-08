import React from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Calendar, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { mockStudents, mockMarks, mockSubjects } from '../../data/mockData';

const StaffDashboard: React.FC = () => {
  const stats = [
    { id: 1, name: 'My Students', value: mockStudents.length, icon: Users, color: 'bg-blue-500' },
    { id: 2, name: 'Subjects Teaching', value: 2, icon: BookOpen, color: 'bg-green-500' },
    { id: 3, name: 'Assignments Graded', value: 15, icon: ClipboardList, color: 'bg-purple-500' },
    { id: 4, name: 'Average Class Performance', value: '82%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Class Average',
        data: [78, 80, 82, 81, 85],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const gradeDistribution = {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    datasets: [
      {
        label: 'Number of Students',
        data: [5, 8, 12, 10, 6, 3, 2, 1],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
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
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance Trends */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Trends</h3>
          <div className="h-64">
            <Line
              data={performanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="h-64">
            <Bar
              data={gradeDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Recent Students */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-4">
            {mockStudents.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center space-x-3">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.course} - Year {student.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Active</p>
                  <p className="text-xs text-gray-500">{student.studentId}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Grade midterm exams</p>
                <p className="text-xs text-gray-500">Due tomorrow</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Update attendance</p>
                <p className="text-xs text-gray-500">Due in 2 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Prepare final exam</p>
                <p className="text-xs text-gray-500">Due next week</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StaffDashboard;