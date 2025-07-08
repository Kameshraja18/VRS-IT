/*
  # Fix RLS infinite recursion in users table

  1. Problem
    - The "Admins can read all users" policy causes infinite recursion
    - Policy tries to query users table from within users table policy
    - This creates a circular dependency

  2. Solution
    - Drop existing problematic policies for users table
    - Recreate policies using JWT claims instead of subqueries
    - Use auth.jwt() to get user role directly from token

  3. Changes
    - Remove recursive policies that query users table
    - Add new policies using JWT claims for role checking
*/

-- Drop existing problematic policies for users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Create new policies using JWT claims to avoid recursion
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Also fix other policies that might have similar issues
-- Drop and recreate policies that reference users table in subqueries

-- Fix students policies
DROP POLICY IF EXISTS "Staff and admins can read students" ON students;
CREATE POLICY "Staff and admins can read students" ON students
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix staff policies
DROP POLICY IF EXISTS "Admins can read all staff" ON staff;
CREATE POLICY "Admins can read all staff" ON staff
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

DROP POLICY IF EXISTS "Admins can manage staff" ON staff;
CREATE POLICY "Admins can manage staff" ON staff
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix marks policies
DROP POLICY IF EXISTS "Staff and admins can read marks" ON marks;
CREATE POLICY "Staff and admins can read marks" ON marks
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "Staff and admins can manage marks" ON marks;
CREATE POLICY "Staff and admins can manage marks" ON marks
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

-- Fix attendance policies
DROP POLICY IF EXISTS "Staff and admins can read attendance" ON attendance;
CREATE POLICY "Staff and admins can read attendance" ON attendance
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

DROP POLICY IF EXISTS "Staff and admins can manage attendance" ON attendance;
CREATE POLICY "Staff and admins can manage attendance" ON attendance
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

-- Fix leaves policies
DROP POLICY IF EXISTS "Admins can read all leaves" ON leaves;
CREATE POLICY "Admins can read all leaves" ON leaves
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

DROP POLICY IF EXISTS "Admins can update leaves" ON leaves;
CREATE POLICY "Admins can update leaves" ON leaves
  FOR UPDATE USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix feedback policies
DROP POLICY IF EXISTS "Admins can update feedback" ON feedback;
CREATE POLICY "Admins can update feedback" ON feedback
  FOR UPDATE USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix notifications policies
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix courses policies
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix sessions policies
DROP POLICY IF EXISTS "Admins can manage sessions" ON sessions;
CREATE POLICY "Admins can manage sessions" ON sessions
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix subjects policies
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Fix login history policies
DROP POLICY IF EXISTS "Admins can read all login history" ON login_history;
CREATE POLICY "Admins can read all login history" ON login_history
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );