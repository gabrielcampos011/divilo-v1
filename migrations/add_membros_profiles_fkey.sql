-- Add foreign key constraint from membros.user_id to profiles.user_id
-- This allows Supabase to understand the relationship for JOINs

-- Drop the constraint if it already exists (to ensure it points to the correct table)
ALTER TABLE membros DROP CONSTRAINT IF EXISTS membros_user_id_fkey;

-- Add the foreign key constraint pointing to profiles
ALTER TABLE membros
ADD CONSTRAINT membros_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON membros(user_id);
