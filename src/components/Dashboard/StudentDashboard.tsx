import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { Line, Radar } from 'react-chartjs-2';
import { mockMarks, mockSubjects } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const stats = [
    { id: 1, name: 'Current GPA', value: '3.4', icon: TrendingUp, color: 'bg-blue-500' },
    { id: 2, name: 'Total Credits', value: '24', icon: BookOpen, color: 'bg-green-500' },
    { id: 3, name: 'Attendance Rate', value: '85%', icon: Calendar, color: 'bg-purple-500' },
    { id: 4, name: 'Upcoming Exams', value: '3', icon: Clock, color: 'bg-orange-500' },
  ];

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'GPA Trend',
        data: [3.2, 3.1, 3.3, 3.4, 3.5, 3.4],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const subjectPerformance = {
    labels: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'English'],
    datasets: [
      {
        label: 'Marks',
        data: [85, 90, 78, 82, 88],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
        {/* GPA Trend */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA Trend</h3>
          <div className="h-64">
            <Line
              data={performanceData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 4.0,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
          <div className="h-64">
            <Radar
              data={subjectPerformance}
              options={radarOptions}
            />
          </div>
        </motion.div>

        {/* Recent Marks */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Marks</h3>
          <div className="space-y-4">
            {mockMarks.map((mark) => {
              const subject = mockSubjects.find(s => s.id === mark.subjectId);
              return (
                <div key={mark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{subject?.name}</p>
                    <p className="text-xs text-gray-500">{mark.examType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{mark.marks}/{mark.totalMarks}</p>
                    <p className="text-xs text-green-600">{mark.grade}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Data Structures Final Exam</p>
                <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Assignment Submission</p>
                <p className="text-xs text-gray-500">Due in 3 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Scholarship Application</p>
                <p className="text-xs text-gray-500">Due next week</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;