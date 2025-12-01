-- 1. CORREÇÃO REPORTS (Performance Auth)
DROP POLICY IF EXISTS "Optimized Insert Reports" ON public.reports;

CREATE POLICY "Optimized Insert Reports"
ON public.reports FOR INSERT
WITH CHECK (
  (select auth.role()) = 'authenticated' -- Envelopado em select para cache
  AND 
  reporter_id = (select auth.uid())
);

-- 2. CORREÇÃO GRUPOS_ACESSO (Remover sobreposição de SELECT)
-- Removemos a política "ALL" que causava conflito de leitura
DROP POLICY IF EXISTS "Leader Modify Access Data" ON public.grupos_acesso;

-- Criamos políticas específicas APENAS para escrita (Leitura fica na Unified Select)
CREATE POLICY "Leader Insert Access Data"
ON public.grupos_acesso FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_acesso.grupo_id AND lider_id = (select auth.uid()))
);

CREATE POLICY "Leader Update Access Data"
ON public.grupos_acesso FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_acesso.grupo_id AND lider_id = (select auth.uid()))
);

CREATE POLICY "Leader Delete Access Data"
ON public.grupos_acesso FOR DELETE
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_acesso.grupo_id AND lider_id = (select auth.uid()))
);

-- 3. CORREÇÃO GRUPOS_PIX (Remover sobreposição de SELECT)
DROP POLICY IF EXISTS "Leader Modify Pix Data" ON public.grupos_pix;

CREATE POLICY "Leader Insert Pix Data"
ON public.grupos_pix FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_pix.grupo_id AND lider_id = (select auth.uid()))
);

CREATE POLICY "Leader Update Pix Data"
ON public.grupos_pix FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_pix.grupo_id AND lider_id = (select auth.uid()))
);

CREATE POLICY "Leader Delete Pix Data"
ON public.grupos_pix FOR DELETE
USING (
  EXISTS (SELECT 1 FROM grupos WHERE id = grupos_pix.grupo_id AND lider_id = (select auth.uid()))
);

-- 4. ÍNDICE FALTANTE
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- Reload
NOTIFY pgrst, 'reload config';
