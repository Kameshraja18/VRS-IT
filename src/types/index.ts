export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'student';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isOnline?: boolean;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  rollNumber: string;
  phone: string;
  address: string;
  course: string;
  year: number;
  semester: number;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated';
  parentName?: string;
  parentPhone?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
}

export interface Staff extends User {
  role: 'staff';
  staffId: string;
  department: string;
  designation: string;
  phone: string;
  subjects: string[];
  joinDate: Date;
  salary: number;
  qualification?: string;
  experience?: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  duration: number; // in years
  department: string;
  description: string;
  totalSeats: number;
  fees: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  department: string;
  description: string;
  courseId: string;
  staffId?: string;
  isActive: boolean;
}

export interface Session {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  sessionId: string;
  marks: number;
  totalMarks: number;
  examType: 'midterm' | 'final' | 'assignment' | 'quiz' | 'practical';
  date: Date;
  grade: string;
  remarks?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  sessionId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  markedBy: string;
}

export interface Leave {
  id: string;
  userId: string;
  userType: 'student' | 'staff';
  leaveType: 'sick' | 'casual' | 'emergency' | 'vacation';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: Date;
  reviewedBy?: string;
  reviewDate?: Date;
  reviewComments?: string;
}

export interface Feedback {
  id: string;
  fromUserId: string;
  fromUserType: 'student' | 'staff';
  toUserId: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'replied';
  createdAt: Date;
  reply?: string;
  repliedAt?: Date;
  repliedBy?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
  isDelivered: boolean;
  isRead: boolean;
  attachments?: string[];
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalCourses: number;
  totalSubjects: number;
  activeStudents: number;
  pendingLeaves: number;
  unreadFeedbacks: number;
  todayAttendance: number;
}