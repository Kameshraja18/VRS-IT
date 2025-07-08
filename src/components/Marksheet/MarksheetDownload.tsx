import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Award, User } from 'lucide-react';
import { mockMarks, mockSubjects, mockSessions } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const MarksheetDownload: React.FC = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<'midterm' | 'final'>('final');

  const getStudentMarks = () => {
    return mockMarks.filter(mark => 
      mark.studentId === user?.id && 
      mark.sessionId === selectedSession &&
      mark.examType === selectedExamType
    );
  };

  const calculateGPA = (marks: typeof mockMarks) => {
    if (marks.length === 0) return 0;
    const totalPoints = marks.reduce((sum, mark) => {
      const percentage = (mark.marks / mark.totalMarks) * 100;
      let points = 0;
      if (percentage >= 90) points = 4.0;
      else if (percentage >= 80) points = 3.7;
      else if (percentage >= 70) points = 3.3;
      else if (percentage >= 60) points = 3.0;
      else if (percentage >= 50) points = 2.7;
      else if (percentage >= 40) points = 2.3;
      else if (percentage >= 30) points = 2.0;
      else points = 0;
      return sum + points;
    }, 0);
    return (totalPoints / marks.length).toFixed(2);
  };

  const generateMarksheet = () => {
    const marks = getStudentMarks();
    const session = mockSessions.find(s => s.id === selectedSession);
    
    if (!marks.length || !session) {
      alert('No marks found for selected session and exam type');
      return;
    }

    // Create marksheet content
    const marksheetContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Marksheet</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .student-info { margin-bottom: 30px; }
          .marks-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .marks-table th, .marks-table td { border: 1px solid #333; padding: 10px; text-align: center; }
          .marks-table th { background-color: #f5f5f5; }
          .footer { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature { text-align: center; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EduManage College</h1>
          <h2>Official Marksheet</h2>
          <p>Session: ${session.name}</p>
          <p>Exam Type: ${selectedExamType.toUpperCase()}</p>
        </div>
        
        <div class="student-info">
          <p><strong>Student Name:</strong> ${user?.name}</p>
          <p><strong>Student ID:</strong> ${(user as any)?.studentId || 'N/A'}</p>
          <p><strong>Course:</strong> ${(user as any)?.course || 'N/A'}</p>
          <p><strong>Year:</strong> ${(user as any)?.year || 'N/A'}</p>
          <p><strong>Semester:</strong> ${(user as any)?.semester || 'N/A'}</p>
        </div>
        
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Marks Obtained</th>
              <th>Total Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${marks.map(mark => {
              const subject = mockSubjects.find(s => s.id === mark.subjectId);
              const percentage = ((mark.marks / mark.totalMarks) * 100).toFixed(1);
              return `
                <tr>
                  <td>${subject?.code || 'N/A'}</td>
                  <td>${subject?.name || 'N/A'}</td>
                  <td>${mark.marks}</td>
                  <td>${mark.totalMarks}</td>
                  <td>${percentage}%</td>
                  <td>${mark.grade}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div style="margin-bottom: 30px;">
          <p><strong>Overall GPA:</strong> ${calculateGPA(marks)}</p>
          <p><strong>Total Subjects:</strong> ${marks.length}</p>
          <p><strong>Date of Issue:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>_____________________</p>
            <p>Controller of Examinations</p>
          </div>
          <div class="signature">
            <p>_____________________</p>
            <p>Principal</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the marksheet
    const blob = new Blob([marksheetContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marksheet_${user?.name?.replace(/\s+/g, '_')}_${selectedExamType}_${session.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const marks = getStudentMarks();
  const gpa = calculateGPA(marks);

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
        <h1 className="text-2xl font-bold text-gray-900">Download Marksheet</h1>
        <FileText className="w-8 h-8 text-blue-600" />
      </div>

      {/* Selection Form */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Marksheet Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Session</option>
              {mockSessions.map(session => (
                <option key={session.id} value={session.id}>{session.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value as 'midterm' | 'final')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="midterm">Midterm Examination</option>
              <option value="final">Final Examination</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Preview */}
      {selectedSession && marks.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Marksheet Preview</h3>
            <button
              onClick={generateMarksheet}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Marksheet</span>
            </button>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Name:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Student ID:</span>
                <span className="font-medium">{(user as any)?.studentId || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">GPA:</span>
                <span className="font-bold text-blue-600">{gpa}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Session:</span>
                <span className="font-medium">{mockSessions.find(s => s.id === selectedSession)?.name}</span>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Marks</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Total</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Percentage</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => {
                  const subject = mockSubjects.find(s => s.id === mark.subjectId);
                  const percentage = ((mark.marks / mark.totalMarks) * 100).toFixed(1);
                  return (
                    <tr key={mark.id}>
                      <td className="border border-gray-300 px-4 py-2">{subject?.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{mark.marks}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{mark.totalMarks}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{percentage}%</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          mark.grade === 'A+' || mark.grade === 'A' 
                            ? 'bg-green-100 text-green-800'
                            : mark.grade === 'B+' || mark.grade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : mark.grade === 'C+' || mark.grade === 'C'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mark.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {selectedSession && marks.length === 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500">No marks available for the selected session and exam type.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MarksheetDownload;