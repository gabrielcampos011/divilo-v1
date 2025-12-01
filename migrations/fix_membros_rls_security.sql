-- Remover políticas antigas para evitar conflitos ou redundância
DROP POLICY IF EXISTS "Líderes podem atualizar status de membros" ON membros;
DROP POLICY IF EXISTS "Membros podem sair do grupo" ON membros;

-- Policy: Apenas o Líder do grupo pode alterar o status de um membro (UPDATE)
CREATE POLICY "Líderes podem atualizar status de membros"
ON membros FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = membros.grupo_id 
    AND lider_id = auth.uid()
  )
);

-- Policy: O próprio usuário pode se remover (sair do grupo) OU o Líder pode removê-lo (DELETE)
CREATE POLICY "Membros podem sair ou serem removidos"
ON membros FOR DELETE
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = membros.grupo_id 
    AND lider_id = auth.uid()
  )
);
