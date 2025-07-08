import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Save, Award, TrendingUp, Download, Users, BookOpen, Calendar, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ExcelUploadMarks from './ExcelUploadMarks';
import ParentReportGenerator from './ParentReportGenerator';

interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  session_id: string;
  marks: number;
  total_marks: number;
  exam_type: string;
  date: string;
  grade: string;
  remarks?: string;
  students?: {
    student_id: string;
    users: {
      name: string;
    };
  };
  subjects?: {
    name: string;
    code: string;
  };
}

const MarksManagement: React.FC = () => {
  const { user } = useAuth();
  const { loading, getMarks, addMarks, getStudents, getSubjects, getSessions } = useSupabaseData();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<string>('midterm');
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [editingMarks, setEditingMarks] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any>(null);
  const [newMark, setNewMark] = useState({
    studentId: '',
    marks: 0,
    totalMarks: 100,
    remarks: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedSession) {
      loadMarks();
    }
  }, [selectedSubject, selectedSession, selectedExamType]);

  const loadInitialData = async () => {
    const [studentsData, subjectsData, sessionsData] = await Promise.all([
      getStudents(),
      getSubjects(),
      getSessions()
    ]);
    
    setStudents(studentsData || []);
    setSubjects(subjectsData || []);
    setSessions(sessionsData || []);
  };

  const loadMarks = async () => {
    const marksData = await getMarks({
      subjectId: selectedSubject,
      sessionId: selectedSession
    });
    setMarks(marksData?.filter((mark: Mark) => mark.exam_type === selectedExamType) || []);
  };

  const canManageMarks = user?.role === 'admin';

  if (!canManageMarks) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators can manage marks.</p>
      </div>
    );
  }

  const filteredStudents = students.filter(student =>
    student.users?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentMark = (studentId: string) => {
    return marks.find(mark => mark.student_id === studentId);
  };

  const calculateGrade = (marks: number, totalMarks: number) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  const saveMarks = async (studentId: string) => {
    const marksValue = editingMarks[studentId];
    if (marksValue === undefined) return;

    const existingMark = getStudentMark(studentId);
    const totalMarks = 100;
    const grade = calculateGrade(marksValue, totalMarks);

    const markData = {
      student_id: studentId,
      subject_id: selectedSubject,
      session_id: selectedSession,
      marks: marksValue,
      total_marks: totalMarks,
      exam_type: selectedExamType,
      date: new Date().toISOString().split('T')[0],
      grade,
      remarks: ''
    };

    try {
      await addMarks(markData);
      await loadMarks(); // Reload marks
      setEditingMarks(prev => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  const handleAddMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMark.studentId || !selectedSubject || !selectedSession) return;

    const grade = calculateGrade(newMark.marks, newMark.totalMarks);
    
    const markData = {
      student_id: newMark.studentId,
      subject_id: selectedSubject,
      session_id: selectedSession,
      marks: newMark.marks,
      total_marks: newMark.totalMarks,
      exam_type: selectedExamType,
      date: new Date().toISOString().split('T')[0],
      grade,
      remarks: newMark.remarks
    };

    try {
      await addMarks(markData);
      await loadMarks();
      setNewMark({ studentId: '', marks: 0, totalMarks: 100, remarks: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding marks:', error);
    }
  };

  const getClassAverage = () => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + mark.marks, 0);
    return Math.round(total / marks.length);
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
        <h1 className="text-2xl font-bold text-gray-900">Marks Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowExcelUpload(!showExcelUpload)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Excel Upload</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Marks</span>
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      {/* Excel Upload Section */}
      {showExcelUpload && (
        <ExcelUploadMarks onUploadComplete={() => {
          loadMarks();
          setShowExcelUpload(false);
        }} />
      )}

      {/* Controls */}
      <AnimatedCard>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Session</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>{session.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sliptest 1">Slip Test 1</option>
                <option value="CA Test 1">CA Test 1</option>
                <option value="slip test 2">Slip Test 2</option>
                <option value="CA Test 2">CA Test 2</option>
                <option value="Anna University exam">Anna University Exam</option>
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
        </div>
      </AnimatedCard>

      {/* Stats */}
      {selectedSubject && selectedSession && (
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class Average</p>
                  <p className="text-2xl font-bold text-gray-900">{getClassAverage()}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marks Entered</p>
                  <p className="text-2xl font-bold text-gray-900">{marks.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {marks.length > 0 ? Math.round((marks.filter(m => m.marks >= 40).length / marks.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Add Marks Form */}
      {showAddForm && (
        <AnimatedCard delay={0.3}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Marks</h3>
            <form onSubmit={handleAddMark} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                  <select
                    value={newMark.studentId}
                    onChange={(e) => setNewMark(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.users?.name} ({student.student_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marks Obtained</label>
                  <input
                    type="number"
                    min="0"
                    max={newMark.totalMarks}
                    value={newMark.marks}
                    onChange={(e) => setNewMark(prev => ({ ...prev, marks: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={newMark.totalMarks}
                    onChange={(e) => setNewMark(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 100 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <input
                    type="text"
                    value={calculateGrade(newMark.marks, newMark.totalMarks)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={newMark.remarks}
                  onChange={(e) => setNewMark(prev => ({ ...prev, remarks: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional remarks..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Marks
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </AnimatedCard>
      )}

      {/* Marks Entry */}
      {selectedSubject && selectedSession && (
        <AnimatedCard delay={0.4}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Marks</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.map((student) => {
                    const existingMark = getStudentMark(student.id);
                    const isEditing = editingMarks[student.id] !== undefined;
                    const currentMarks = isEditing ? editingMarks[student.id] : existingMark?.marks || 0;

                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={student.users?.avatar || `https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400`}
                            alt={student.users?.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{student.users?.name}</h4>
                            <p className="text-sm text-gray-500">{student.student_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentMarks}
                              onChange={(e) => setEditingMarks(prev => ({
                                ...prev,
                                [student.id]: parseInt(e.target.value) || 0
                              }))}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-500">/ 100</span>
                          </div>
                          {existingMark && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              existingMark.grade === 'A+' || existingMark.grade === 'A' 
                                ? 'bg-green-100 text-green-800'
                                : existingMark.grade === 'B+' || existingMark.grade === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : existingMark.grade === 'C+' || existingMark.grade === 'C'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {existingMark.grade}
                            </span>
                          )}
                          <button
                            onClick={() => saveMarks(student.id)}
                            disabled={!isEditing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setSelectedStudentForReport(student)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Parent Report Generator Modal */}
      {selectedStudentForReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generate Parent Report</h2>
              <button
                onClick={() => setSelectedStudentForReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <ParentReportGenerator
              studentId={selectedStudentForReport.id}
              studentName={selectedStudentForReport.users?.name}
              parentEmail={selectedStudentForReport.parent_email}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MarksManagement;