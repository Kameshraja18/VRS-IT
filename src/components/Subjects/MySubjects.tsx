import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Clock, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import { Line } from 'react-chartjs-2';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  department: string;
  description?: string;
  staff_id?: string;
  is_active: boolean;
}

const MySubjects: React.FC = () => {
  const { user } = useAuth();
  const { loading, getSubjects, getMarks, getAttendance } = useSupabaseData();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectStats, setSubjectStats] = useState<any>({});

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    let subjectsData: Subject[] = [];
    
    if (user?.role === 'student') {
      // For students, get subjects based on their course and semester
      subjectsData = await getSubjects();
      // Filter based on student's course and semester
    } else if (user?.role === 'staff') {
      // For staff, get subjects they are teaching
      subjectsData = await getSubjects();
      subjectsData = subjectsData.filter(subject => subject.staff_id === user.id);
    }
    
    setSubjects(subjectsData || []);
    
    // Load stats for each subject
    const stats: any = {};
    for (const subject of subjectsData) {
      if (user?.role === 'student') {
        const marks = await getMarks({ studentId: user.id, subjectId: subject.id });
        const attendance = await getAttendance({ studentId: user.id, subjectId: subject.id });
        stats[subject.id] = {
          averageMarks: marks.length > 0 ? marks.reduce((sum: number, mark: any) => sum + mark.marks, 0) / marks.length : 0,
          attendancePercentage: attendance.length > 0 ? (attendance.filter((a: any) => a.status === 'present').length / attendance.length) * 100 : 0,
          totalClasses: attendance.length,
          totalAssignments: marks.length
        };
      } else if (user?.role === 'staff') {
        const marks = await getMarks({ subjectId: subject.id });
        const attendance = await getAttendance({ subjectId: subject.id });
        stats[subject.id] = {
          totalStudents: new Set(marks.map((m: any) => m.student_id)).size,
          averageMarks: marks.length > 0 ? marks.reduce((sum: number, mark: any) => sum + mark.marks, 0) / marks.length : 0,
          attendanceRate: attendance.length > 0 ? (attendance.filter((a: any) => a.status === 'present').length / attendance.length) * 100 : 0,
          totalClasses: new Set(attendance.map((a: any) => a.date)).size
        };
      }
    }
    setSubjectStats(stats);
  };

  const getPerformanceData = (subjectId: string) => {
    // Mock performance data - in real app, this would come from database
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        {
          label: user?.role === 'student' ? 'My Performance' : 'Class Average',
          data: [75, 78, 82, 85, 83, 87],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
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
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {user?.role === 'student' ? 'My Subjects' : 'Teaching Subjects'}
        </h1>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => {
          const stats = subjectStats[subject.id] || {};
          return (
            <AnimatedCard key={subject.id} delay={index * 0.1}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{subject.code}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {subject.credits} Credits
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Sem {subject.semester}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>

                {subject.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
                )}

                {/* Stats for Students */}
                {user?.role === 'student' && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Marks</span>
                      <span className="font-semibold text-blue-600">{stats.averageMarks?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <span className="font-semibold text-green-600">{stats.attendancePercentage?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Classes</span>
                      <span className="font-semibold text-gray-700">{stats.totalClasses || 0}</span>
                    </div>
                  </div>
                )}

                {/* Stats for Staff */}
                {user?.role === 'staff' && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students</span>
                      <span className="font-semibold text-blue-600">{stats.totalStudents || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Class Average</span>
                      <span className="font-semibold text-green-600">{stats.averageMarks?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance Rate</span>
                      <span className="font-semibold text-purple-600">{stats.attendanceRate?.toFixed(1) || 0}%</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedSubject(subject)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </motion.div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Subject Details Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <AnimatedCard>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSubject.name}</h2>
                  <p className="text-gray-600">{selectedSubject.code} • {selectedSubject.department}</p>
                </div>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                  <div className="h-64">
                    <Line
                      data={getPerformanceData(selectedSubject.id)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Subject Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-medium">{selectedSubject.credits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Semester:</span>
                        <span className="font-medium">{selectedSubject.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedSubject.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${selectedSubject.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedSubject.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedSubject.description && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700">{selectedSubject.description}</p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {user?.role === 'student' ? (
                        <>
                          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            View Marks
                          </button>
                          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                            View Attendance
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Mark Attendance
                          </button>
                          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                            Enter Marks
                          </button>
                          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            View Students
                          </button>
                          <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                            Generate Report
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedCard>
        </div>
      )}
    </motion.div>
  );
};

export default MySubjects;