/*
  # Fix infinite recursion in profiles RLS policies

  1. Security Changes
    - Drop existing conflicting policies on profiles table
    - Create simplified, non-recursive policies
    - Ensure admin checks don't cause circular references

  2. Policy Structure
    - Separate public read access from authenticated user access
    - Use auth.uid() directly without additional profile lookups for basic operations
    - Create a separate policy for admin operations that doesn't recurse
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new non-recursive policies

-- Allow public read access to basic profile information
CREATE POLICY "Public can read profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create a function to check admin role without recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Admin policy using the function (this avoids recursion in policy evaluation)
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());