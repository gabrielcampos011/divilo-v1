-- Allow group leaders to view all members of their groups
CREATE POLICY "Leaders can view all members of their groups"
ON membros FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM grupos
        WHERE grupos.id = membros.grupo_id
        AND grupos.lider_id = auth.uid()
    )
);

-- Allow users to view their own membership status
CREATE POLICY "Users can view their own membership"
ON membros FOR SELECT
USING (auth.uid() = user_id);
