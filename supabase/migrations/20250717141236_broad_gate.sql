/*
  # Fix Subjects Table RLS Insert Policy

  1. Security Changes
    - Drop existing restrictive policies that prevent subject creation
    - Create new policies that properly check user roles from JWT token
    - Allow admin and staff roles to insert, update, and delete subjects
    - Maintain read access for all authenticated users

  2. Policy Details
    - INSERT: Only admin and staff can create subjects
    - UPDATE: Only admin and staff can modify subjects
    - DELETE: Only admin and staff can delete subjects
    - SELECT: All authenticated users can read subjects
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Admins and staff can insert subjects" ON subjects;
DROP POLICY IF EXISTS "Admins and staff can update subjects" ON subjects;
DROP POLICY IF EXISTS "Admins and staff can delete subjects" ON subjects;
DROP POLICY IF EXISTS "Anyone can read subjects" ON subjects;

-- Create new INSERT policy for admin and staff
CREATE POLICY "Admin and staff can insert subjects"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

-- Create new UPDATE policy for admin and staff
CREATE POLICY "Admin and staff can update subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

-- Create new DELETE policy for admin and staff
CREATE POLICY "Admin and staff can delete subjects"
  ON subjects
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text IN ('admin', 'staff')
  );

-- Create new SELECT policy for all authenticated users
CREATE POLICY "Authenticated users can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);