import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { initGSAP } from './lib/gsapAnimations';
import Login from './components/Auth/Login';
import StudentSignup from './components/Auth/StudentSignup';
import StaffSignup from './components/Auth/StaffSignup';
import LandingPage from './components/Landing/LandingPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import EnhancedAdminDashboard from './components/Dashboard/EnhancedAdminDashboard';
import StaffDashboard from './components/Dashboard/StaffDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import EnhancedStudentsList from './components/Students/EnhancedStudentsList';
import CoursesList from './components/Courses/CoursesList';
import AttendanceManagement from './components/Attendance/AttendanceManagement';
import StudentProfile from './components/Profile/StudentProfile';
import StaffProfile from './components/Profile/StaffProfile';
import SubjectManagement from './components/Subjects/SubjectManagement';
import MySubjects from './components/Subjects/MySubjects';
import MarksManagement from './components/Marks/MarksManagement';
import LeaveManagement from './components/Leaves/LeaveManagement';
import FeedbackManagement from './components/Feedback/FeedbackManagement';
import NotificationCenter from './components/Notifications/NotificationCenter';
import SessionManagement from './components/Sessions/SessionManagement';
import LoginHistoryView from './components/LoginHistory/LoginHistoryView';
import MarksheetDownload from './components/Marksheet/MarksheetDownload';
import ResultDeclaration from './components/ResultDeclaration/ResultDeclaration';
import AssessmentManagement from './components/Assessments/AssessmentManagement';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initGSAP();
  }, []);

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'subjects':
        setActiveTab('subjects');
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'admin') return <EnhancedAdminDashboard onQuickAction={handleQuickAction} />;
        if (user?.role === 'staff') return <StaffDashboard />;
        if (user?.role === 'student') return <StudentDashboard />;
        return <div>Dashboard</div>;
      case 'profile':
        if (user?.role === 'student') return <StudentProfile />;
        if (user?.role === 'staff') return <StaffProfile />;
        return <div>Profile</div>;
      case 'students':
        return <EnhancedStudentsList />;
      case 'courses':
        return <CoursesList />;
      case 'subjects':
        if (user?.role === 'admin' || user?.role === 'staff') {
          return <SubjectManagement />;
        }
        return <MySubjects />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'marks':
        return <MarksManagement />;
      case 'leaves':
        return <LeaveManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'sessions':
        return <SessionManagement />;
      case 'login-history':
        return <LoginHistoryView />;
      case 'marksheet':
        return <MarksheetDownload />;
      case 'result-declaration':
        return <ResultDeclaration />;
      case 'assessments':
        return <AssessmentManagement />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <div className="p-6"><h1 className="text-2xl font-bold text-gray-900">Coming Soon</h1></div>;
    }
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-signup" element={
            <StudentSignup 
              onBack={() => window.location.href = '/login'} 
              onSuccess={() => window.location.href = '/login'} 
            />
          } />
          <Route path="/staff-signup" element={
            <StaffSignup 
              onBack={() => window.location.href = '/login'} 
              onSuccess={() => window.location.href = '/login'} 
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex page-enter">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="flex-1 flex flex-col">
            <Header 
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
              onNotificationClick={handleNotificationClick}
            />
            <main className="flex-1 overflow-y-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;