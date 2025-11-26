-- Add foreign key constraint from grupos.lider_id to profiles.user_id
-- This allows Supabase to understand the relationship for JOINs

-- First, ensure all existing lider_id values have corresponding profiles
-- (This should already be the case if the trigger is working)

-- Add the foreign key constraint
ALTER TABLE grupos
ADD CONSTRAINT grupos_lider_id_fkey
FOREIGN KEY (lider_id)
REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_grupos_lider_id ON grupos(lider_id);
