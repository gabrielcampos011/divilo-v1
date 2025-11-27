-- Fix infinite recursion in RLS policy
-- The previous policy caused recursion because it queried 'membros' while checking permissions for 'membros'

-- Drop the problematic policy
DROP POLICY IF EXISTS "Members can view other members of their group" ON membros;

-- Create a secure function to check membership without recursion
-- This function accesses 'membros' with elevated privileges (SECURITY DEFINER)
-- bypassing RLS to avoid the recursion loop
CREATE OR REPLACE FUNCTION public.is_member_of_group(_grupo_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM membros
    WHERE grupo_id = _grupo_id
    AND user_id = auth.uid()
    AND status IN ('aprovado', 'pago')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the policy using the secure function
CREATE POLICY "Members can view other members of their group"
ON membros FOR SELECT
USING (
    public.is_member_of_group(grupo_id)
);
