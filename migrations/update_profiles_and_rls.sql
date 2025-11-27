-- Add email column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the create_profile_on_signup function to include email
CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill email for existing profiles (optional, but good for consistency)
UPDATE profiles
SET email = (SELECT email FROM auth.users WHERE auth.users.id = profiles.user_id)
WHERE email IS NULL;

-- Update RLS for membros to allow members to see other members of the same group
CREATE POLICY "Members can view other members of their group"
ON membros FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM membros AS m2
        WHERE m2.grupo_id = membros.grupo_id
        AND m2.status IN ('aprovado', 'pago')
    )
);
