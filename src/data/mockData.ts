import { 
  User, 
  Student, 
  Staff, 
  Subject, 
  Mark, 
  Attendance, 
  Course, 
  Session, 
  Leave, 
  Feedback, 
  Message, 
  ChatGroup, 
  Notification, 
  LoginHistory 
} from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin1@gmail.com',
    name: 'Dr. Principal Kumar',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-11-20T09:30:00'),
    isOnline: true
  },
  {
    id: '2',
    email: 'admin2@gmail.com',
    name: 'Vice Principal Sharma',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-11-20T09:30:00'),
    isOnline: true
  },
  {
    id: '3',
    email: 'staff1@gmail.com',
    name: 'Dr. Rajesh Kumar',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2024-11-20T08:15:00'),
    isOnline: true
  },
  {
    id: '4',
    email: 'staff2@gmail.com',
    name: 'Prof. Priya Sharma',
    role: 'staff',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2024-11-20T08:15:00'),
    isOnline: true
  },
  {
    id: '5',
    email: 'student1@gmail.com',
    name: 'Karthik Raj',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-08-15'),
    lastLogin: new Date('2024-11-20T10:00:00'),
    isOnline: false
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Computer Science Engineering',
    code: 'CSE',
    duration: 4,
    department: 'Computer Science',
    description: 'Comprehensive computer science program covering programming, algorithms, and software engineering',
    totalSeats: 60,
    fees: 50000,
    isActive: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Information Technology',
    code: 'IT',
    duration: 4,
    department: 'Information Technology',
    description: 'Information technology program with focus on modern IT solutions and emerging technologies',
    totalSeats: 60,
    fees: 48000,
    isActive: true,
    createdAt: new Date('2023-01-01')
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Academic Year 2024-25',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2025-07-31'),
    isActive: true,
    createdAt: new Date('2024-06-01')
  },
  {
    id: '2',
    name: 'Academic Year 2023-24',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2024-07-31'),
    isActive: false,
    createdAt: new Date('2023-06-01')
  }
];

// Anna University 2021 Regulation Subjects for CSE and IT
export const mockSubjects: Subject[] = [
  // CSE Semester 1
  { id: '1', name: 'Communicative English', code: 'HS8151', credits: 4, semester: 1, department: 'CSE', description: 'English communication skills', courseId: '1', staffId: '3', isActive: true },
  { id: '2', name: 'Mathematics I', code: 'MA8151', credits: 4, semester: 1, department: 'CSE', description: 'Calculus and differential equations', courseId: '1', staffId: '3', isActive: true },
  { id: '3', name: 'Engineering Physics', code: 'PH8151', credits: 3, semester: 1, department: 'CSE', description: 'Basic physics concepts', courseId: '1', staffId: '3', isActive: true },
  { id: '4', name: 'Engineering Chemistry', code: 'CY8151', credits: 3, semester: 1, department: 'CSE', description: 'Basic chemistry concepts', courseId: '1', staffId: '3', isActive: true },
  { id: '5', name: 'Problem Solving and Python Programming', code: 'GE8151', credits: 3, semester: 1, department: 'CSE', description: 'Introduction to programming with Python', courseId: '1', staffId: '3', isActive: true },
  { id: '6', name: 'Engineering Graphics', code: 'GE8152', credits: 4, semester: 1, department: 'CSE', description: 'Technical drawing and CAD', courseId: '1', staffId: '3', isActive: true },

  // CSE Semester 2
  { id: '7', name: 'Technical English', code: 'HS8251', credits: 4, semester: 2, department: 'CSE', description: 'Technical communication', courseId: '1', staffId: '3', isActive: true },
  { id: '8', name: 'Mathematics II', code: 'MA8251', credits: 4, semester: 2, department: 'CSE', description: 'Linear algebra and vector calculus', courseId: '1', staffId: '3', isActive: true },
  { id: '9', name: 'Physics and Chemistry Laboratory', code: 'BS8251', credits: 2, semester: 2, department: 'CSE', description: 'Lab experiments', courseId: '1', staffId: '3', isActive: true },

  // CSE Semester 3
  { id: '10', name: 'Discrete Mathematics', code: 'MA8351', credits: 4, semester: 3, department: 'CSE', description: 'Mathematical foundations for computer science', courseId: '1', staffId: '3', isActive: true },
  { id: '11', name: 'Digital Principles and System Design', code: 'CS8351', credits: 3, semester: 3, department: 'CSE', description: 'Digital logic and computer organization', courseId: '1', staffId: '3', isActive: true },
  { id: '12', name: 'Data Structures', code: 'CS8391', credits: 3, semester: 3, department: 'CSE', description: 'Fundamental data structures and algorithms', courseId: '1', staffId: '3', isActive: true },
  { id: '13', name: 'Object Oriented Programming', code: 'CS8392', credits: 3, semester: 3, department: 'CSE', description: 'OOP concepts using Java', courseId: '1', staffId: '3', isActive: true },

  // IT Semester 1
  { id: '14', name: 'Communicative English', code: 'HS8151', credits: 4, semester: 1, department: 'IT', description: 'English communication skills', courseId: '2', staffId: '4', isActive: true },
  { id: '15', name: 'Mathematics I', code: 'MA8151', credits: 4, semester: 1, department: 'IT', description: 'Calculus and differential equations', courseId: '2', staffId: '4', isActive: true },
  { id: '16', name: 'Engineering Physics', code: 'PH8151', credits: 3, semester: 1, department: 'IT', description: 'Basic physics concepts', courseId: '2', staffId: '4', isActive: true },
  { id: '17', name: 'Engineering Chemistry', code: 'CY8151', credits: 3, semester: 1, department: 'IT', description: 'Basic chemistry concepts', courseId: '2', staffId: '4', isActive: true },
  { id: '18', name: 'Problem Solving and Python Programming', code: 'GE8151', credits: 3, semester: 1, department: 'IT', description: 'Introduction to programming with Python', courseId: '2', staffId: '4', isActive: true },

  // IT Semester 3
  { id: '19', name: 'Discrete Mathematics', code: 'MA8351', credits: 4, semester: 3, department: 'IT', description: 'Mathematical foundations for IT', courseId: '2', staffId: '4', isActive: true },
  { id: '20', name: 'Digital Principles and Computer Organization', code: 'IT8351', credits: 3, semester: 3, department: 'IT', description: 'Digital systems and computer architecture', courseId: '2', staffId: '4', isActive: true }
];

export const mockStudents: Student[] = [
  {
    id: '5',
    email: 'student1@gmail.com',
    name: 'Karthik Raj',
    role: 'student',
    studentId: 'VRS2024CSE001',
    rollNumber: 'VRS2024CSE001',
    phone: '+919876543210',
    address: '123 Student St, Chennai',
    course: 'Computer Science Engineering',
    year: 1,
    semester: 1,
    enrollmentDate: new Date('2024-08-15'),
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    parentName: 'Rajesh Raj',
    parentPhone: '+919876543211',
    dateOfBirth: new Date('2006-05-15'),
    bloodGroup: 'O+',
    lastLogin: new Date('2024-11-20T10:00:00'),
    isOnline: false
  },
  {
    id: '6',
    email: 'student2@gmail.com',
    name: 'Priya Nair',
    role: 'student',
    studentId: 'VRS2024CSE002',
    rollNumber: 'VRS2024CSE002',
    phone: '+919876543212',
    address: '456 Campus Ave, Chennai',
    course: 'Computer Science Engineering',
    year: 1,
    semester: 1,
    enrollmentDate: new Date('2024-08-15'),
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-08-15'),
    parentName: 'Suresh Nair',
    parentPhone: '+919876543213',
    dateOfBirth: new Date('2006-03-20'),
    bloodGroup: 'A+',
    lastLogin: new Date('2024-11-19T16:30:00'),
    isOnline: true
  }
];

export const mockStaff: Staff[] = [
  {
    id: '3',
    email: 'staff1@gmail.com',
    name: 'Dr. Rajesh Kumar',
    role: 'staff',
    staffId: 'FAC001',
    department: 'Computer Science',
    designation: 'Professor',
    phone: '+919876543220',
    subjects: ['CS8151', 'CS8391'],
    joinDate: new Date('2020-08-15'),
    salary: 75000,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2020-08-15'),
    qualification: 'Ph.D Computer Science',
    experience: 10,
    lastLogin: new Date('2024-11-20T08:15:00'),
    isOnline: true
  },
  {
    id: '4',
    email: 'staff2@gmail.com',
    name: 'Prof. Priya Sharma',
    role: 'staff',
    staffId: 'FAC002',
    department: 'Information Technology',
    designation: 'Associate Professor',
    phone: '+919876543221',
    subjects: ['IT8351', 'MA8351'],
    joinDate: new Date('2021-08-15'),
    salary: 65000,
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2021-08-15'),
    qualification: 'M.Tech Information Technology',
    experience: 8,
    lastLogin: new Date('2024-11-20T08:15:00'),
    isOnline: true
  }
];

export const mockMarks: Mark[] = [
  {
    id: '1',
    studentId: '5',
    subjectId: '1',
    sessionId: '1',
    marks: 85,
    totalMarks: 100,
    examType: 'slip test 1',
    date: new Date('2024-10-15'),
    grade: 'A',
    remarks: 'Excellent performance'
  },
  {
    id: '2',
    studentId: '5',
    subjectId: '2',
    sessionId: '1',
    marks: 78,
    totalMarks: 100,
    examType: 'CA Test 1',
    date: new Date('2024-10-16'),
    grade: 'B+',
    remarks: 'Good understanding'
  },
  {
    id: '3',
    studentId: '6',
    subjectId: '1',
    sessionId: '1',
    marks: 92,
    totalMarks: 100,
    examType: 'slip test 1',
    date: new Date('2024-10-17'),
    grade: 'A+',
    remarks: 'Outstanding work'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    studentId: '5',
    subjectId: '1',
    sessionId: '1',
    date: new Date('2024-11-01'),
    status: 'present',
    markedBy: '3'
  },
  {
    id: '2',
    studentId: '5',
    subjectId: '2',
    sessionId: '1',
    date: new Date('2024-11-01'),
    status: 'present',
    markedBy: '3'
  },
  {
    id: '3',
    studentId: '6',
    subjectId: '1',
    sessionId: '1',
    date: new Date('2024-11-01'),
    status: 'absent',
    markedBy: '3',
    remarks: 'Medical leave'
  }
];

export const mockLeaves: Leave[] = [
  {
    id: '1',
    userId: '5',
    userType: 'student',
    leaveType: 'sick',
    startDate: new Date('2024-11-25'),
    endDate: new Date('2024-11-27'),
    reason: 'Fever and flu symptoms',
    status: 'pending',
    appliedDate: new Date('2024-11-20')
  },
  {
    id: '2',
    userId: '3',
    userType: 'staff',
    leaveType: 'casual',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-03'),
    reason: 'Family function',
    status: 'approved',
    appliedDate: new Date('2024-11-15'),
    reviewedBy: '1',
    reviewDate: new Date('2024-11-18'),
    reviewComments: 'Approved for family function'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    fromUserId: '5',
    fromUserType: 'student',
    toUserId: '1',
    subject: 'Library Facilities',
    message: 'The library needs more computer systems for research work.',
    status: 'pending',
    createdAt: new Date('2024-11-18')
  },
  {
    id: '2',
    fromUserId: '3',
    fromUserType: 'staff',
    toUserId: '1',
    subject: 'Classroom Equipment',
    message: 'Need projector replacement in Room 101.',
    status: 'replied',
    createdAt: new Date('2024-11-15'),
    reply: 'Equipment replacement has been scheduled for next week.',
    repliedAt: new Date('2024-11-17'),
    repliedBy: '1'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '3',
    receiverId: '5',
    content: 'Please submit your assignment by tomorrow.',
    type: 'text',
    timestamp: new Date('2024-11-20T10:30:00'),
    isDelivered: true,
    isRead: false
  },
  {
    id: '2',
    senderId: '5',
    receiverId: '3',
    content: 'Yes, I will submit it today.',
    type: 'text',
    timestamp: new Date('2024-11-20T10:35:00'),
    isDelivered: true,
    isRead: true
  }
];

export const mockChatGroups: ChatGroup[] = [
  {
    id: '1',
    name: 'CSE Year 1 - Batch 2024',
    description: 'Group for CSE Year 1 students',
    members: ['3', '5', '6'],
    createdBy: '3',
    createdAt: new Date('2024-09-01'),
    isActive: true
  },
  {
    id: '2',
    name: 'Faculty Discussion',
    description: 'Group for faculty members',
    members: ['1', '3', '4'],
    createdBy: '1',
    createdAt: new Date('2024-08-15'),
    isActive: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '5',
    title: 'Assignment Due',
    message: 'Your Data Structures assignment is due tomorrow.',
    type: 'warning',
    isRead: false,
    createdAt: new Date('2024-11-20T09:00:00'),
    actionUrl: '/assignments'
  },
  {
    id: '2',
    userId: '5',
    title: 'Result Published',
    message: 'Your slip test 1 results have been published.',
    type: 'success',
    isRead: false,
    createdAt: new Date('2024-11-19T14:30:00'),
    actionUrl: '/results'
  }
];

export const mockLoginHistory: LoginHistory[] = [
  {
    id: '1',
    userId: '5',
    loginTime: new Date('2024-11-20T10:00:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'College Campus'
  },
  {
    id: '2',
    userId: '3',
    loginTime: new Date('2024-11-20T08:15:00'),
    logoutTime: new Date('2024-11-20T17:30:00'),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'Faculty Office'
  }
];