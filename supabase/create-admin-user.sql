-- Create Admin User Script
-- Run this in Supabase SQL Editor to create an admin user
-- 
-- IMPORTANT: This script uses Supabase's auth.admin API functions
-- Make sure you're running this with proper permissions

-- Step 1: Create the user (if using Supabase Dashboard Auth, you can also create manually)
-- Note: In Supabase, you typically create users through the Auth UI or API
-- This SQL will set the role after the user is created

-- If the user already exists, this will update their role
-- If the user doesn't exist, create them first via Supabase Dashboard > Authentication > Users > Add User

-- Step 2: Set admin role in app_metadata
-- This function updates the user's app_metadata to include admin role
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'info@francescatabor.com';

  -- If user exists, update their app_metadata
  IF user_id IS NOT NULL THEN
    UPDATE auth.users
    SET 
      raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      ),
      updated_at = NOW()
    WHERE id = user_id;
    
    RAISE NOTICE 'Admin role set for user: info@francescatabor.com';
  ELSE
    RAISE NOTICE 'User not found. Please create the user first via Supabase Dashboard > Authentication > Users';
  END IF;
END $$;

-- Alternative: If you want to create the user directly via SQL (requires service role)
-- Uncomment and use this if you have service role access:
/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'info@francescatabor.com',
  crypt('Brazil89*', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"role": "admin", "provider": "email", "providers": ["email"]}'::jsonb,
  '{}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- Verify the user was created/updated
SELECT 
  id,
  email,
  raw_app_meta_data->>'role' as role,
  created_at,
  updated_at
FROM auth.users
WHERE email = 'info@francescatabor.com';

