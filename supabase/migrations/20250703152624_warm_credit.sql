/*
  # College Management System Database Schema

  1. New Tables
    - `users` - Base user table for all roles (admin, staff, student)
    - `courses` - Academic courses offered by the college
    - `sessions` - Academic sessions/years
    - `subjects` - Subjects taught in different courses
    - `students` - Extended student information
    - `staff` - Extended staff information
    - `marks` - Student marks and grades
    - `attendance` - Student attendance records
    - `leaves` - Leave applications
    - `feedback` - Feedback from students/staff
    - `messages` - Chat messages
    - `chat_groups` - Group chat information
    - `notifications` - System notifications
    - `login_history` - User login/logout tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'student');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE leave_type AS ENUM ('sick', 'casual', 'emergency', 'vacation');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE exam_type AS ENUM ('midterm', 'final', 'assignment', 'quiz', 'practical');
CREATE TYPE feedback_status AS ENUM ('pending', 'reviewed', 'replied');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Users table (base for all roles)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_online boolean DEFAULT false
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  duration integer NOT NULL,
  department text NOT NULL,
  description text,
  total_seats integer DEFAULT 0,
  fees numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  credits integer DEFAULT 3,
  semester integer NOT NULL,
  department text NOT NULL,
  description text,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES users(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Students table (extends users)
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  roll_number text UNIQUE NOT NULL,
  phone text,
  address text,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  year integer DEFAULT 1,
  semester integer DEFAULT 1,
  enrollment_date date DEFAULT CURRENT_DATE,
  status user_status DEFAULT 'active',
  parent_name text,
  parent_phone text,
  date_of_birth date,
  blood_group text
);

-- Staff table (extends users)
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  staff_id text UNIQUE NOT NULL,
  department text NOT NULL,
  designation text NOT NULL,
  phone text,
  join_date date DEFAULT CURRENT_DATE,
  salary numeric DEFAULT 0,
  qualification text,
  experience integer DEFAULT 0
);

-- Marks table
CREATE TABLE IF NOT EXISTS marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  marks numeric NOT NULL,
  total_marks numeric NOT NULL,
  exam_type exam_type NOT NULL,
  date date DEFAULT CURRENT_DATE,
  grade text,
  remarks text,
  created_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  date date NOT NULL,
  status attendance_status NOT NULL,
  remarks text,
  marked_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Leaves table
CREATE TABLE IF NOT EXISTS leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status leave_status DEFAULT 'pending',
  applied_date date DEFAULT CURRENT_DATE,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  review_date date,
  review_comments text,
  created_at timestamptz DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  to_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status feedback_status DEFAULT 'pending',
  reply text,
  replied_at timestamptz,
  replied_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Chat groups table
CREATE TABLE IF NOT EXISTS chat_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar text,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Chat group members table
CREATE TABLE IF NOT EXISTS chat_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES chat_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  group_id uuid REFERENCES chat_groups(id) ON DELETE SET NULL,
  content text NOT NULL,
  type message_type DEFAULT 'text',
  is_delivered boolean DEFAULT false,
  is_read boolean DEFAULT false,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'info',
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Login history table
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  login_time timestamptz DEFAULT now(),
  logout_time timestamptz,
  ip_address text,
  user_agent text,
  location text
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for courses
CREATE POLICY "Anyone can read courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for sessions
CREATE POLICY "Anyone can read sessions" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sessions" ON sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for subjects
CREATE POLICY "Anyone can read subjects" ON subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for students
CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Staff and admins can read students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can manage students" ON students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for staff
CREATE POLICY "Staff can read own data" ON staff
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can read all staff" ON staff
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage staff" ON staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for marks
CREATE POLICY "Students can read own marks" ON marks
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Staff and admins can read marks" ON marks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admins can manage marks" ON marks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create policies for attendance
CREATE POLICY "Students can read own attendance" ON attendance
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Staff and admins can read attendance" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admins can manage attendance" ON attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create policies for leaves
CREATE POLICY "Users can read own leaves" ON leaves
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can read all leaves" ON leaves
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create leaves" ON leaves
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update leaves" ON leaves
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for feedback
CREATE POLICY "Users can read own feedback" ON feedback
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Admins can update feedback" ON feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create policies for messages
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM chat_group_members 
      WHERE group_id = messages.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create policies for chat groups
CREATE POLICY "Members can read groups" ON chat_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_group_members 
      WHERE group_id = chat_groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups" ON chat_groups
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create policies for chat group members
CREATE POLICY "Members can read group membership" ON chat_group_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM chat_group_members cgm2
      WHERE cgm2.group_id = chat_group_members.group_id AND cgm2.user_id = auth.uid()
    )
  );

-- Create policies for login history
CREATE POLICY "Users can read own login history" ON login_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can read all login history" ON login_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert login history" ON login_history
  FOR INSERT WITH CHECK (true);