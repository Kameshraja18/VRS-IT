import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error('Supabase error:', err);
    setError(err.message || 'An error occurred');
    setLoading(false);
    return null;
  };

  // User operations
  const createUser = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const updateUser = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getUsers = async (role?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('users').select('*');
      if (role) {
        query = query.eq('role', role);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      // Return mock data if Supabase fails
      return [
        {
          id: '1',
          email: 'admin1@gmail.com',
          name: 'Dr. Principal Kumar',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_online: true
        }
      ];
    }
  };

  // Student operations
  const createStudent = async (studentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const updateStudent = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          users (name, email, avatar),
          courses (name, code)
        `);
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      // Return mock data if Supabase fails
      return [
        {
          id: '1',
          student_id: 'VRS2024CSE001',
          roll_number: 'VRS2024CSE001',
          phone: '+919876543210',
          status: 'active',
          year: 1,
          semester: 1,
          users: {
            name: 'Karthik Raj',
            email: 'student1@gmail.com',
            avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'
          },
          courses: {
            name: 'Computer Science Engineering',
            code: 'CSE'
          }
        },
        {
          id: '2',
          student_id: 'VRS2024CSE002',
          roll_number: 'VRS2024CSE002',
          phone: '+919876543211',
          status: 'active',
          year: 1,
          semester: 1,
          users: {
            name: 'Priya Nair',
            email: 'student2@gmail.com',
            avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400'
          },
          courses: {
            name: 'Computer Science Engineering',
            code: 'CSE'
          }
        }
      ];
    }
  };

  // Staff operations
  const createStaff = async (staffData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const updateStaff = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          users (name, email, avatar)
        `);
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      // Return mock data if Supabase fails
      return [
        {
          id: '1',
          staff_id: 'FAC001',
          department: 'Computer Science',
          designation: 'Professor',
          phone: '+919876543220',
          qualification: 'Ph.D Computer Science',
          experience: 10,
          join_date: '2020-08-15',
          salary: 75000,
          users: {
            name: 'Dr. Rajesh Kumar',
            email: 'staff1@gmail.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        },
        {
          id: '2',
          staff_id: 'FAC002',
          department: 'Information Technology',
          designation: 'Associate Professor',
          phone: '+919876543221',
          qualification: 'M.Tech Information Technology',
          experience: 8,
          join_date: '2021-08-15',
          salary: 65000,
          users: {
            name: 'Prof. Priya Sharma',
            email: 'staff2@gmail.com',
            avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        }
      ];
    }
  };

  // Course operations
  const createCourse = async (courseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [
        {
          id: '1',
          name: 'Computer Science Engineering',
          code: 'CSE',
          duration: 4,
          department: 'Computer Science',
          description: 'Comprehensive computer science program',
          total_seats: 60,
          fees: 50000,
          is_active: true
        },
        {
          id: '2',
          name: 'Information Technology',
          code: 'IT',
          duration: 4,
          department: 'Information Technology',
          description: 'Information technology program',
          total_seats: 60,
          fees: 48000,
          is_active: true
        }
      ];
    }
  };

  // Subject operations
  const createSubject = async (subjectData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          *,
          courses (name, code),
          users (name)
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [
        {
          id: '1',
          name: 'Data Structures',
          code: 'CS201',
          credits: 4,
          semester: 3,
          department: 'Computer Science',
          description: 'Fundamental data structures and algorithms',
          is_active: true,
          courses: { name: 'Computer Science Engineering', code: 'CSE' },
          users: { name: 'Dr. Rajesh Kumar' }
        }
      ];
    }
  };

  // Attendance operations
  const markAttendance = async (attendanceData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert(attendanceData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getAttendance = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students (student_id, users (name)),
          subjects (name, code),
          sessions (name)
        `);

      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.subjectId) query = query.eq('subject_id', filters.subjectId);
      if (filters?.date) query = query.eq('date', filters.date);
      
      const { data, error } = await query;
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  // Marks operations
  const addMarks = async (marksData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('marks')
        .insert(marksData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getMarks = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('marks')
        .select(`
          *,
          students (student_id, users (name)),
          subjects (name, code),
          sessions (name)
        `);

      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.subjectId) query = query.eq('subject_id', filters.subjectId);
      if (filters?.sessionId) query = query.eq('session_id', filters.sessionId);
      
      const { data, error } = await query;
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  // Leave operations
  const applyLeave = async (leaveData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leaves')
        .insert(leaveData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const updateLeave = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leaves')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getLeaves = async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('leaves')
        .select(`
          *,
          users (name, role)
        `);

      if (userId) query = query.eq('user_id', userId);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  // Feedback operations
  const submitFeedback = async (feedbackData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert(feedbackData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getFeedback = async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('feedback')
        .select(`
          *,
          from_user:users!feedback_from_user_id_fkey (name, role),
          to_user:users!feedback_to_user_id_fkey (name, role)
        `);

      if (userId) {
        query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  // Notification operations
  const createNotification = async (notificationData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getNotifications = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  const markNotificationRead = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  // Session operations
  const createSession = async (sessionData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [
        {
          id: '1',
          name: 'Academic Year 2024-25',
          start_date: '2024-08-01',
          end_date: '2025-07-31',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
    }
  };

  // Login history
  const recordLogin = async (loginData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('login_history')
        .insert(loginData)
        .select()
        .single();
      
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  const getLoginHistory = async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('login_history')
        .select(`
          *,
          users (name, role)
        `);

      if (userId) query = query.eq('user_id', userId);
      
      const { data, error } = await query.order('login_time', { ascending: false });
      if (error) throw error;
      
      setLoading(false);
      return data || [];
    } catch (err) {
      handleError(err);
      return [];
    }
  };

  return {
    loading,
    error,
    // User operations
    createUser,
    updateUser,
    getUsers,
    // Student operations
    createStudent,
    updateStudent,
    getStudents,
    // Staff operations
    createStaff,
    updateStaff,
    getStaff,
    // Course operations
    createCourse,
    getCourses,
    // Subject operations
    createSubject,
    getSubjects,
    // Attendance operations
    markAttendance,
    getAttendance,
    // Marks operations
    addMarks,
    getMarks,
    // Leave operations
    applyLeave,
    updateLeave,
    getLeaves,
    // Feedback operations
    submitFeedback,
    getFeedback,
    // Notification operations
    createNotification,
    getNotifications,
    markNotificationRead,
    // Session operations
    createSession,
    getSessions,
    // Login history
    recordLogin,
    getLoginHistory
  };
};