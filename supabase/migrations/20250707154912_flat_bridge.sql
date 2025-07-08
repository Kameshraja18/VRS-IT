/*
  # Update exam types to match VRS-IT requirements

  1. Changes
    - Update exam_type enum to include the 5 specific exam types required
    - Drop and recreate the enum with new values
    - Update any existing records to use new enum values

  2. New Exam Types
    - slip test 1
    - CA Test 1  
    - slip test 2
    - CA Test 2
    - Anna University exam
*/

-- First, drop the existing enum and recreate with new values
-- We need to handle this carefully to avoid breaking existing data

-- Create new enum type
CREATE TYPE exam_type_new AS ENUM (
  'slip test 1',
  'CA Test 1', 
  'slip test 2',
  'CA Test 2',
  'Anna University exam'
);

-- Update the marks table to use the new enum
ALTER TABLE marks 
  ALTER COLUMN exam_type TYPE exam_type_new 
  USING CASE 
    WHEN exam_type::text = 'midterm' THEN 'CA Test 1'::exam_type_new
    WHEN exam_type::text = 'final' THEN 'Anna University exam'::exam_type_new
    WHEN exam_type::text = 'assignment' THEN 'slip test 1'::exam_type_new
    WHEN exam_type::text = 'quiz' THEN 'slip test 2'::exam_type_new
    WHEN exam_type::text = 'practical' THEN 'CA Test 2'::exam_type_new
    ELSE 'slip test 1'::exam_type_new
  END;

-- Drop the old enum type
DROP TYPE exam_type;

-- Rename the new enum type to the original name
ALTER TYPE exam_type_new RENAME TO exam_type;