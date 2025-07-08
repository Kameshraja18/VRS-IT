import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error('Supabase error:', err);
    setError(err.message || 'An error occurred');
    setLoading(false);
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
      handleError(err);
      return null;
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      return data;
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
      handleError(err);
      return null;
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
      return data;
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
      handleError(err);
      return null;
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
      handleError(err);
      return null;
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
      return data;
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
      handleError(err);
      return null;
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
      return data;
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
      handleError(err);
      return null;
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
      return data;
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
      handleError(err);
      return null;
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
      handleError(err);
      return null;
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
      return data;
    } catch (err) {
      handleError(err);
      return [];
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
      handleError(err);
      return null;
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
      return data;
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