-- 1. CORREÇÃO DE ÍNDICES (REPORTS)
-- Garante que buscas por quem denunciou ou foi denunciado sejam rápidas
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
-- CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON public.reports(reported_user_id); -- Column does not exist
CREATE INDEX IF NOT EXISTS idx_reports_group_id ON public.reports(group_id);

-- 2. UNIFICAÇÃO DE UPDATE EM 'membros' (Resolve 'multiple_permissive_policies')
-- Removemos as duas políticas antigas que colidiam
DROP POLICY IF EXISTS "Leader update group requests" ON public.membros;
DROP POLICY IF EXISTS "Líderes podem atualizar status de membros" ON public.membros;

-- Criamos uma única política otimizada para Líderes
CREATE POLICY "Unified update policy for leaders"
ON public.membros
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = membros.grupo_id 
    AND lider_id = (select auth.uid()) -- Otimização com (select ...)
  )
);

-- 3. OTIMIZAÇÃO DE INSERT/DELETE EM 'membros' (Resolve 'auth_rls_initplan')
-- Dropamos as versões lentas
DROP POLICY IF EXISTS "User create membership" ON public.membros;
DROP POLICY IF EXISTS "User delete own membership" ON public.membros;
DROP POLICY IF EXISTS "Leader remove member" ON public.membros;

-- Recriamos com cache de auth.uid()
CREATE POLICY "User create membership optimized"
ON public.membros
FOR INSERT
WITH CHECK (
  user_id = (select auth.uid()) -- Garante que só pode criar pra si mesmo
);

CREATE POLICY "Unified delete policy (User or Leader)"
ON public.membros
FOR DELETE
USING (
  -- O próprio usuário sai
  user_id = (select auth.uid())
  OR
  -- OU o líder remove
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = membros.grupo_id 
    AND lider_id = (select auth.uid())
  )
);

-- 4. OTIMIZAÇÃO EM 'reports'
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.reports;

CREATE POLICY "Authenticated users can create reports optimized"
ON public.reports
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND 
  reporter_id = (select auth.uid())
);

-- Recarregar configurações
NOTIFY pgrst, 'reload config';
