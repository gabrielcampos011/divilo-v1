-- =========================================================
-- 1. TABELA REPORTS (Fix auth_rls_initplan)
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Final Optimized Insert Reports" ON public.reports;

CREATE POLICY "Optimized View Reports"
ON public.reports FOR SELECT
USING (reporter_id = (select auth.uid()));

CREATE POLICY "Optimized Insert Reports"
ON public.reports FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND 
  reporter_id = (select auth.uid())
);

-- =========================================================
-- 2. TABELA GRUPOS (Fix multiple policies for SELECT)
-- =========================================================
-- O problema: Temos "Leader full access" (ALL) + "Public read" (SELECT). Isso duplica o check no SELECT.
-- Solução: Deixar "Leader" apenas para modificação (INSERT/UPDATE/DELETE) e manter "Public" para leitura.

DROP POLICY IF EXISTS "Leader full access grupos" ON public.grupos;
-- Mantemos "Public read grupos" como está (assumindo que já existe)

-- Recriar política de Líder APENAS para modificação
CREATE POLICY "Leader modify grupos"
ON public.grupos
FOR UPDATE
USING (lider_id = (select auth.uid()));

CREATE POLICY "Leader delete grupos"
ON public.grupos
FOR DELETE
USING (lider_id = (select auth.uid()));

CREATE POLICY "Leader insert grupos"
ON public.grupos
FOR INSERT
WITH CHECK (lider_id = (select auth.uid()));


-- =========================================================
-- 3. TABELA GRUPOS_ACESSO (Fix multiple policies for SELECT)
-- =========================================================
-- O problema: "Leaders manage" + "Paid members view".
-- Solução: Unificar SELECT. Separar Modify.

DROP POLICY IF EXISTS "Leaders manage group access" ON public.grupos_acesso;
DROP POLICY IF EXISTS "Paid members view group access" ON public.grupos_acesso;

-- Política ÚNICA de Leitura (Líder OU Membro Pago)
CREATE POLICY "Unified Select Access Data"
ON public.grupos_acesso FOR SELECT
USING (
  -- É o Líder
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_acesso.grupo_id AND lider_id = (select auth.uid()))
  OR
  -- É Membro Pago
  EXISTS (
    SELECT 1 FROM membros 
    WHERE grupo_id = grupos_acesso.grupo_id 
    AND user_id = (select auth.uid())
    AND status = 'pago'
  )
);

-- Política de Modificação (Apenas Líder)
CREATE POLICY "Leader Modify Access Data"
ON public.grupos_acesso
FOR ALL
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_acesso.grupo_id AND lider_id = (select auth.uid()))
);


-- =========================================================
-- 4. TABELA GRUPOS_PIX (Fix multiple policies for SELECT)
-- =========================================================
-- O problema: "Leaders manage" + "Members view".
-- Solução: Unificar SELECT. Separar Modify.

DROP POLICY IF EXISTS "Leaders manage group pix" ON public.grupos_pix;
DROP POLICY IF EXISTS "Members view group pix" ON public.grupos_pix;

-- Política ÚNICA de Leitura (Líder OU Membro)
CREATE POLICY "Unified Select Pix Data"
ON public.grupos_pix FOR SELECT
USING (
  -- É o Líder
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_pix.grupo_id AND lider_id = (select auth.uid()))
  OR
  -- É Membro (Qualquer status aprovado/pendente/pago geralmente precisa ver pra pagar)
  EXISTS (
    SELECT 1 FROM membros 
    WHERE grupo_id = grupos_pix.grupo_id 
    AND user_id = (select auth.uid())
  )
);

-- Política de Modificação (Apenas Líder)
CREATE POLICY "Leader Modify Pix Data"
ON public.grupos_pix
FOR ALL
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_pix.grupo_id AND lider_id = (select auth.uid()))
);

-- Reload
NOTIFY pgrst, 'reload config';
