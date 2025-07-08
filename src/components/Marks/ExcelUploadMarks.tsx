import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, FileSpreadsheet, Check, X, AlertCircle } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';

interface ExcelUploadMarksProps {
  onUploadComplete: () => void;
}

interface StudentMark {
  studentId: string;
  studentName: string;
  rollNumber: string;
  subject1: number;
  subject2: number;
  subject3: number;
  subject4: number;
  subject5: number;
  attendance: number;
}

const ExcelUploadMarks: React.FC<ExcelUploadMarksProps> = ({ onUploadComplete }) => {
  const { addMarks, createNotification } = useSupabaseData();
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const templateData = [
      ['Student ID', 'Student Name', 'Roll Number', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Attendance %'],
      ['STU001', 'John Doe', 'VRS2024CSE001', '85', '78', '92', '88', '82', '95'],
      ['STU002', 'Jane Smith', 'VRS2024CSE002', '90', '85', '88', '92', '87', '98'],
      ['STU003', 'Mike Johnson', 'VRS2024CSE003', '78', '82', '85', '80', '79', '92']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'marks_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): StudentMark[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        studentId: values[0],
        studentName: values[1],
        rollNumber: values[2],
        subject1: parseFloat(values[3]) || 0,
        subject2: parseFloat(values[4]) || 0,
        subject3: parseFloat(values[5]) || 0,
        subject4: parseFloat(values[6]) || 0,
        subject5: parseFloat(values[7]) || 0,
        attendance: parseFloat(values[8]) || 0
      };
    });
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    if (marks >= 30) return 'D';
    return 'F';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResults(null);

    try {
      const text = await file.text();
      const studentMarks = parseCSV(text);
      
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      const subjects = [
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Physics' },
        { id: '3', name: 'Chemistry' },
        { id: '4', name: 'Computer Science' },
        { id: '5', name: 'English' }
      ];

      for (const studentMark of studentMarks) {
        try {
          // Upload marks for each subject
          const subjectMarks = [
            studentMark.subject1,
            studentMark.subject2,
            studentMark.subject3,
            studentMark.subject4,
            studentMark.subject5
          ];

          for (let i = 0; i < subjects.length; i++) {
            const marks = subjectMarks[i];
            if (marks > 0) {
              const markData = {
                student_id: studentMark.studentId,
                subject_id: subjects[i].id,
                session_id: '1', // Current session
                marks: marks,
                total_marks: 100,
                exam_type: 'final',
                date: new Date().toISOString().split('T')[0],
                grade: calculateGrade(marks),
                remarks: `Uploaded via Excel - Attendance: ${studentMark.attendance}%`
              };

              await addMarks(markData);
            }
          }

          // Send notification to student
          await createNotification({
            user_id: studentMark.studentId,
            title: 'Results Published',
            message: `Your examination results have been published. Overall attendance: ${studentMark.attendance}%`,
            type: 'success',
            action_url: '/marks'
          });

          successCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Failed to upload marks for ${studentMark.studentName}: ${error}`);
        }
      }

      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors
      });

      if (successCount > 0) {
        onUploadComplete();
      }
    } catch (error) {
      setUploadResults({
        success: 0,
        failed: 1,
        errors: [`Failed to parse file: ${error}`]
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <AnimatedCard>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Excel Upload for Marks
        </h3>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Download the template file first</li>
              <li>• Fill in student marks for each subject (0-100)</li>
              <li>• Include attendance percentage for each student</li>
              <li>• Save as CSV format and upload</li>
              <li>• All students will be automatically notified</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Download Template</h4>
              <p className="text-sm text-gray-600">Get the Excel template with sample data</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900">Upload Marks File</h4>
                <p className="text-gray-600">Choose a CSV or Excel file with student marks</p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Upload Results */}
          {uploadResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Successful</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{uploadResults.success}</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{uploadResults.failed}</p>
                </div>
              </div>

              {uploadResults.errors.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Errors</span>
                  </div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {uploadResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ExcelUploadMarks;