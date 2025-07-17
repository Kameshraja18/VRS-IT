import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface Student {
  id: string;
  student_id: string;
  roll_number: string;
  users: {
    name: string;
    email: string;
    avatar?: string;
  };
  courses: {
    name: string;
    code: string;
  };
  year: number;
  semester: number;
  phone?: string;
  status: string;
}

const EnhancedStudentsList: React.FC = () => {
  const { user } = useAuth();
  const { loading, getStudents } = useSupabaseData();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const studentsData = await getStudents();
      if (studentsData) {
        setStudents(studentsData);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !filterCourse || student.courses?.code === filterCourse;
    const matchesYear = !filterYear || student.year.toString() === filterYear;
    
    return matchesSearch && matchesCourse && matchesYear;
  });

  const canManageStudents = user?.role === 'admin';
  const canViewStudents = user?.role === 'admin' || user?.role === 'staff';

  if (!canViewStudents) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view student information.</p>
      </div>
    );
  }

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
          Students Management
        </h1>
        {canManageStudents && (
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Filters */}
      <AnimatedCard>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">All Courses</option>
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* Students Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <AnimatedCard key={student.id} delay={index * 0.1}>
              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={student.users.avatar || `https://images.pexels.com/photos/${1516680 + index}/pexels-photo-${1516680 + index}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                      alt={student.users.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.users.name}</h3>
                    <p className="text-sm text-gray-500">{student.student_id}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Course:</span>
                    <span className="font-medium">{student.courses?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Year:</span>
                    <span className="font-medium">{student.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Semester:</span>
                    <span className="font-medium">{student.semester}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Roll No:</span>
                    <span className="font-medium">{student.roll_number}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  {canManageStudents && (
                    <>
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <AnimatedCard>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStudent.users.avatar || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedStudent.users.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStudent.users.name}</h3>
                    <p className="text-gray-600">{selectedStudent.users.email}</p>
                    <p className="text-gray-600">{selectedStudent.student_id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <p className="text-gray-900">{selectedStudent.courses?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                    <p className="text-gray-900">{selectedStudent.roll_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <p className="text-gray-900">{selectedStudent.year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <p className="text-gray-900">{selectedStudent.semester}</p>
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

export default EnhancedStudentsList;