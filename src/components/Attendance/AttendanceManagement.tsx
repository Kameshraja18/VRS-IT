import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Check, X, Search, Filter, Download, Clock } from 'lucide-react';
import { mockStudents, mockAttendance, mockSubjects } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState(mockAttendance);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const newAttendance = {
      id: Date.now().toString(),
      studentId,
      subjectId: selectedSubject,
      sessionId: '1',
      date: new Date(selectedDate),
      status,
      markedBy: user?.id || '1'
    };
    setAttendanceData(prev => [...prev, newAttendance]);
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendanceData.find(
      att => att.studentId === studentId && 
      att.date.toDateString() === new Date(selectedDate).toDateString() &&
      att.subjectId === selectedSubject
    )?.status;
  };

  const getAttendanceStats = () => {
    const totalStudents = filteredStudents.length;
    const presentCount = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'present').length;
    const absentCount = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'absent').length;
    const lateCount = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'late').length;
    
    return { totalStudents, presentCount, absentCount, lateCount };
  };

  const stats = getAttendanceStats();

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
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {mockSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lateCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Attendance List */}
      {selectedSubject && (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const status = getAttendanceStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'late')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          status === 'late'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AttendanceManagement;