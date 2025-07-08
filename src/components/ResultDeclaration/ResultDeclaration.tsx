import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Award, Upload, Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface ResultData {
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjects: {
    id: string;
    name: string;
    marks: number;
    totalMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  totalObtained: number;
  percentage: number;
  gpa: number;
  result: 'Pass' | 'Fail';
}

const ResultDeclaration: React.FC = () => {
  const { loading, getStudents, getMarks, createNotification } = useSupabaseData();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedExamType, setSelectedExamType] = useState<'midterm' | 'final'>('final');
  const [results, setResults] = useState<ResultData[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResults, setPublishedResults] = useState<string[]>([]);

  useEffect(() => {
    if (selectedSession) {
      loadResults();
    }
  }, [selectedSession, selectedExamType]);

  const loadResults = async () => {
    // This would fetch actual results from Supabase
    // For now, using mock data
    const mockResults: ResultData[] = [
      {
        studentId: '1',
        studentName: 'John Doe',
        rollNumber: 'VRS2024CSE001',
        subjects: [
          { id: '1', name: 'Data Structures', marks: 85, totalMarks: 100, grade: 'A' },
          { id: '2', name: 'Algorithms', marks: 78, totalMarks: 100, grade: 'B+' },
          { id: '3', name: 'Database Systems', marks: 92, totalMarks: 100, grade: 'A+' },
        ],
        totalMarks: 300,
        totalObtained: 255,
        percentage: 85,
        gpa: 8.5,
        result: 'Pass'
      },
      {
        studentId: '2',
        studentName: 'Jane Smith',
        rollNumber: 'VRS2024CSE002',
        subjects: [
          { id: '1', name: 'Data Structures', marks: 72, totalMarks: 100, grade: 'B+' },
          { id: '2', name: 'Algorithms', marks: 68, totalMarks: 100, grade: 'B' },
          { id: '3', name: 'Database Systems', marks: 88, totalMarks: 100, grade: 'A' },
        ],
        totalMarks: 300,
        totalObtained: 228,
        percentage: 76,
        gpa: 7.6,
        result: 'Pass'
      }
    ];
    setResults(mockResults);
  };

  const publishResults = async () => {
    setIsPublishing(true);
    
    try {
      // Animate the publishing process
      const resultCards = document.querySelectorAll('.result-card');
      
      for (let i = 0; i < resultCards.length; i++) {
        await new Promise(resolve => {
          gsap.to(resultCards[i], {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              setPublishedResults(prev => [...prev, results[i].studentId]);
              resolve(true);
            }
          });
        });
        
        // Send notification to student
        await createNotification({
          user_id: results[i].studentId,
          title: 'Results Published',
          message: `Your ${selectedExamType} examination results have been published.`,
          type: 'success',
          action_url: '/marks'
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Show success animation
      gsap.to('.publish-success', {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
    } catch (error) {
      console.error('Error publishing results:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const downloadResultSheet = () => {
    // Generate CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Roll Number,Student Name,Total Marks,Obtained Marks,Percentage,GPA,Result\n"
      + results.map(result => 
          `${result.rollNumber},${result.studentName},${result.totalMarks},${result.totalObtained},${result.percentage}%,${result.gpa},${result.result}`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `results_${selectedExamType}_${selectedSession}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Award className="w-8 h-8 mr-3 text-blue-600" />
          Result Declaration
        </h1>
        {results.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={downloadResultSheet}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Results</span>
            </button>
            <button
              onClick={publishResults}
              disabled={isPublishing || publishedResults.length === results.length}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isPublishing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {publishedResults.length === results.length ? 'Published' : 'Publish Results'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <AnimatedCard>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Results to Publish</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Session</option>
                <option value="2024-25">Academic Year 2024-25</option>
                <option value="2023-24">Academic Year 2023-24</option>
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
        </div>
      </AnimatedCard>

      {/* Results Summary */}
      {results.length > 0 && (
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.result === 'Pass').length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.result === 'Fail').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
                </div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <AnimatedCard
              key={result.studentId}
              delay={0.3 + index * 0.1}
              className="result-card"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.studentName}</h3>
                      <p className="text-gray-600">{result.rollNumber}</p>
                    </div>
                    {publishedResults.includes(result.studentId) && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Published</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      result.result === 'Pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.result}
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.percentage}% • GPA: {result.gpa}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.subjects.map((subject) => (
                    <div key={subject.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      <div className="text-lg font-bold text-gray-700">
                        {subject.marks}/{subject.totalMarks}
                      </div>
                      <div className={`text-sm font-medium ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'text-green-600' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'text-blue-600' :
                        subject.grade === 'C+' || subject.grade === 'C' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Grade: {subject.grade}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">Total: </span>
                      <span className="font-semibold">{result.totalObtained}/{result.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Percentage: </span>
                      <span className="font-semibold">{result.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">GPA: </span>
                      <span className="font-semibold">{result.gpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Success Message */}
      <div className="publish-success fixed inset-0 flex items-center justify-center z-50 opacity-0 scale-0 pointer-events-none">
        <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Results Published Successfully!</h3>
          <p className="text-gray-600">All students have been notified about their results.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDeclaration;