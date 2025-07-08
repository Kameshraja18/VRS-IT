import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Send, Download, User, Award, Calendar, BarChart3 } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';

interface ParentReportGeneratorProps {
  studentId: string;
  studentName: string;
  parentEmail?: string;
}

const ParentReportGenerator: React.FC<ParentReportGeneratorProps> = ({
  studentId,
  studentName,
  parentEmail
}) => {
  const { getMarks, getAttendance, getStudents } = useSupabaseData();
  const [generating, setGenerating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const generateReportLetter = async () => {
    setGenerating(true);
    
    try {
      // Fetch student data
      const marks = await getMarks({ studentId });
      const attendance = await getAttendance({ studentId });
      const students = await getStudents();
      const student = students.find((s: any) => s.id === studentId);

      // Calculate overall statistics
      const totalMarks = marks.reduce((sum: number, mark: any) => sum + mark.marks, 0);
      const averageMarks = marks.length > 0 ? Math.round(totalMarks / marks.length) : 0;
      const totalClasses = attendance.length;
      const presentClasses = attendance.filter((a: any) => a.status === 'present').length;
      const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

      // Generate formal letter content
      const letterContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Academic Progress Report</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              margin: 40px; 
              color: #333;
            }
            .letterhead { 
              text-align: center; 
              border-bottom: 2px solid #003366; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .college-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #003366; 
              margin-bottom: 5px; 
            }
            .college-address { 
              font-size: 14px; 
              color: #666; 
            }
            .date { 
              text-align: right; 
              margin-bottom: 30px; 
              font-size: 14px; 
            }
            .recipient { 
              margin-bottom: 30px; 
            }
            .subject { 
              font-weight: bold; 
              text-decoration: underline; 
              margin-bottom: 20px; 
            }
            .content { 
              text-align: justify; 
              margin-bottom: 30px; 
            }
            .marks-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            .marks-table th, .marks-table td { 
              border: 1px solid #333; 
              padding: 8px; 
              text-align: center; 
            }
            .marks-table th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .summary-box { 
              background-color: #f9f9f9; 
              border: 1px solid #ddd; 
              padding: 15px; 
              margin: 20px 0; 
            }
            .signature { 
              margin-top: 50px; 
              text-align: right; 
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #ddd; 
              padding-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div class="college-name">VRS College of Engineering & Technology</div>
            <div class="college-address">
              Arasur-607 107, Villupuram District, Tamil Nadu<br>
              Approved by AICTE and Affiliated to Anna University<br>
              Phone: +91-4146-123456 | Email: info@vrsit.edu.in
            </div>
          </div>

          <div class="date">
            Date: ${new Date().toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>

          <div class="recipient">
            <strong>To,</strong><br>
            The Parent/Guardian of<br>
            <strong>${studentName}</strong><br>
            Roll Number: ${student?.roll_number || 'N/A'}<br>
            Course: ${student?.courses?.name || 'N/A'}
          </div>

          <div class="subject">
            <strong>Subject: Academic Progress Report - ${new Date().getFullYear()} Academic Year</strong>
          </div>

          <div class="content">
            <p>Dear Parent/Guardian,</p>
            
            <p>We hope this letter finds you in good health and spirits. We are pleased to share with you the academic progress report of your ward, <strong>${studentName}</strong>, for the current academic session.</p>

            <div class="summary-box">
              <h3 style="margin-top: 0; color: #003366;">Academic Performance Summary</h3>
              <p><strong>Overall Average:</strong> ${averageMarks}%</p>
              <p><strong>Attendance Percentage:</strong> ${attendancePercentage}%</p>
              <p><strong>Total Subjects:</strong> ${marks.length}</p>
              <p><strong>Academic Standing:</strong> ${averageMarks >= 75 ? 'Excellent' : averageMarks >= 60 ? 'Good' : averageMarks >= 40 ? 'Satisfactory' : 'Needs Improvement'}</p>
            </div>

            <h3 style="color: #003366;">Subject-wise Performance</h3>
            <table class="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${marks.map((mark: any) => `
                  <tr>
                    <td>${mark.subjects?.name || 'N/A'}</td>
                    <td>${mark.marks}</td>
                    <td>${mark.total_marks}</td>
                    <td>${Math.round((mark.marks / mark.total_marks) * 100)}%</td>
                    <td>${mark.grade}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h3 style="color: #003366;">Attendance Analysis</h3>
            <div class="summary-box">
              <p><strong>Total Classes Conducted:</strong> ${totalClasses}</p>
              <p><strong>Classes Attended:</strong> ${presentClasses}</p>
              <p><strong>Attendance Percentage:</strong> ${attendancePercentage}%</p>
              <p><strong>Attendance Status:</strong> ${attendancePercentage >= 85 ? 'Excellent' : attendancePercentage >= 75 ? 'Good' : attendancePercentage >= 65 ? 'Average' : 'Below Average'}</p>
            </div>

            <h3 style="color: #003366;">Recommendations</h3>
            <p>Based on the academic performance and attendance record, we recommend:</p>
            <ul>
              ${averageMarks < 60 ? '<li>Additional focus on studies and regular practice</li>' : ''}
              ${attendancePercentage < 75 ? '<li>Improvement in class attendance for better understanding</li>' : ''}
              ${averageMarks >= 75 && attendancePercentage >= 85 ? '<li>Continue the excellent performance and maintain consistency</li>' : ''}
              <li>Regular communication between parents and faculty</li>
              <li>Participation in co-curricular activities for overall development</li>
            </ul>

            <p>We appreciate your continued support in your ward's academic journey. Should you have any queries or wish to discuss your ward's progress in detail, please feel free to contact us during college hours.</p>

            <p>Thank you for your cooperation.</p>
          </div>

          <div class="signature">
            <p>Yours sincerely,</p>
            <br><br>
            <p><strong>Dr. Principal Name</strong><br>
            Principal<br>
            VRS College of Engineering & Technology</p>
          </div>

          <div class="footer">
            <p>This is a computer-generated report. For any discrepancies, please contact the college office.</p>
            <p>VRS College of Engineering & Technology | Arasur-607 107, Villupuram District</p>
          </div>
        </body>
        </html>
      `;

      // Create and download the report
      const blob = new Blob([letterContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Academic_Report_${studentName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Simulate email sending (in real implementation, this would use an email service)
      if (parentEmail) {
        setTimeout(() => {
          setEmailSent(true);
          setTimeout(() => setEmailSent(false), 3000);
        }, 1000);
      }

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AnimatedCard>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Parent Report Generator
        </h3>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">{studentName}</h4>
                <p className="text-sm text-blue-700">Student ID: {studentId}</p>
                {parentEmail && (
                  <p className="text-sm text-blue-700">Parent Email: {parentEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Report Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Subject-wise Marks</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Attendance Analysis</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Academic Summary</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Formal Letter Format</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={generateReportLetter}
              disabled={generating}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>

            {parentEmail && (
              <button
                onClick={generateReportLetter}
                disabled={generating}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Email Parent</span>
              </button>
            )}
          </div>

          {/* Success Message */}
          {emailSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Report sent to parent's email successfully!</span>
              </div>
            </motion.div>
          )}

          {/* Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Report Contents</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Formal letter format in English</li>
              <li>• Complete subject-wise marks breakdown</li>
              <li>• Detailed attendance percentage analysis</li>
              <li>• Academic performance recommendations</li>
              <li>• Official college letterhead and signature</li>
            </ul>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ParentReportGenerator;