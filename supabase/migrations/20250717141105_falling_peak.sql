/*
  # Fix Subjects Table RLS Policy

  1. Security Updates
    - Drop existing restrictive INSERT policy for subjects table
    - Add new INSERT policy that allows admins and staff to create subjects
    - Ensure proper role-based access control

  2. Changes Made
    - Remove old INSERT policy that was blocking subject creation
    - Add new policy that checks user role from JWT token
    - Allow both admin and staff roles to insert subjects
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

-- Create separate policies for better control
CREATE POLICY "Admins and staff can insert subjects"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) = ANY(ARRAY['admin'::text, 'staff'::text])
  );

CREATE POLICY "Admins and staff can update subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) = ANY(ARRAY['admin'::text, 'staff'::text])
  )
  WITH CHECK (
    (auth.jwt() ->> 'role'::text) = ANY(ARRAY['admin'::text, 'staff'::text])
  );

CREATE POLICY "Admins and staff can delete subjects"
  ON subjects
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) = ANY(ARRAY['admin'::text, 'staff'::text])
  );

-- Keep the existing SELECT policy for reading subjects
-- This should already exist and allow anyone to read subjects