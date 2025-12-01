-- =========================================================
-- 1. TABELA MEMBROS (Limpeza de Duplicatas INSERT/DELETE)
-- =========================================================

-- Remover TODAS as variações antigas e novas conflitantes
DROP POLICY IF EXISTS "User create membership" ON public.membros;
DROP POLICY IF EXISTS "User create membership optimized" ON public.membros;
DROP POLICY IF EXISTS "Unified delete policy (User or Leader)" ON public.membros;
DROP POLICY IF EXISTS "Membros podem sair ou serem removidos" ON public.membros;
DROP POLICY IF EXISTS "User delete own membership" ON public.membros;
DROP POLICY IF EXISTS "Leader remove member" ON public.membros;

-- Recriar APENAS a versão final (Otimizada com cache de auth)
CREATE POLICY "Final Optimized Insert Membros"
ON public.membros FOR INSERT
WITH CHECK (
  user_id = (select auth.uid())
);

CREATE POLICY "Final Optimized Delete Membros"
ON public.membros FOR DELETE
USING (
  user_id = (select auth.uid()) 
  OR 
  EXISTS (SELECT 1 FROM grupos WHERE id = membros.grupo_id AND lider_id = (select auth.uid()))
);


-- =========================================================
-- 2. TABELA NOTIFICAÇÕES (Limpeza de Duplicatas INSERT)
-- =========================================================

DROP POLICY IF EXISTS "Users can insert notifications" ON public.notificacoes;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notificacoes;

-- Política permissiva para permitir notificações entre usuários (Sistema/Líder -> Membro)
CREATE POLICY "Final Insert Notificacoes"
ON public.notificacoes FOR INSERT
WITH CHECK (true);


-- =========================================================
-- 3. TABELA REPORTS (Limpeza de Duplicatas INSERT)
-- =========================================================

DROP POLICY IF EXISTS "Authenticated users can create reports optimized" ON public.reports;
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.reports;

CREATE POLICY "Final Optimized Insert Reports"
ON public.reports FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND 
  reporter_id = (select auth.uid())
);

-- =========================================================
-- 4. APPLY
-- =========================================================
NOTIFY pgrst, 'reload config';
