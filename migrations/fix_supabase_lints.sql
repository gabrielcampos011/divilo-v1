-- Otimização de RLS baseada nos lints do Supabase
-- Objetivos:
-- 1. Usar (select auth.uid()) para permitir cache de plano de execução (auth_rls_initplan).
-- 2. Unificar políticas permissivas múltiplas (multiple_permissive_policies).

-- ==============================================================================
-- Tabela: grupos_pix
-- ==============================================================================
DROP POLICY IF EXISTS "Leader full access pix" ON grupos_pix;
DROP POLICY IF EXISTS "Member view pix" ON grupos_pix;
DROP POLICY IF EXISTS "Leaders can manage their group PIX" ON grupos_pix;
DROP POLICY IF EXISTS "Approved members can view PIX" ON grupos_pix;

-- Política Unificada para Líderes (Gerenciamento Total)
CREATE POLICY "Leaders manage group pix"
ON grupos_pix
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = grupos_pix.grupo_id 
    AND lider_id = (select auth.uid())
  )
);

-- Política Unificada para Membros (Visualização)
CREATE POLICY "Members view group pix"
ON grupos_pix
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM membros 
    WHERE grupo_id = grupos_pix.grupo_id 
    AND user_id = (select auth.uid()) 
    AND status IN ('aprovado', 'pago')
  )
);

-- ==============================================================================
-- Tabela: grupos_acesso
-- ==============================================================================
DROP POLICY IF EXISTS "Leader full access credentials" ON grupos_acesso;
DROP POLICY IF EXISTS "Member view credentials" ON grupos_acesso;
DROP POLICY IF EXISTS "Leaders can manage their group access" ON grupos_acesso;
DROP POLICY IF EXISTS "Paid members can view access credentials" ON grupos_acesso;

-- Política Unificada para Líderes (Gerenciamento Total)
CREATE POLICY "Leaders manage group access"
ON grupos_acesso
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = grupos_acesso.grupo_id 
    AND lider_id = (select auth.uid())
  )
);

-- Política Unificada para Membros Pagos (Visualização)
CREATE POLICY "Paid members view group access"
ON grupos_acesso
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM membros 
    WHERE grupo_id = grupos_acesso.grupo_id 
    AND user_id = (select auth.uid()) 
    AND status = 'pago'
  )
);

-- ==============================================================================
-- Tabela: notificacoes
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notificacoes;
DROP POLICY IF EXISTS "Users can update own notifications" ON notificacoes;

CREATE POLICY "Users manage own notifications"
ON notificacoes
FOR ALL
USING (user_id = (select auth.uid()));

-- ==============================================================================
-- Tabela: profiles
-- ==============================================================================
-- Nota: Profiles geralmente tem políticas de SELECT públicas ou autenticadas, e UPDATE apenas para o dono.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users update own profile"
ON profiles
FOR UPDATE
USING (user_id = (select auth.uid()));

-- ==============================================================================
-- Tabela: stripe_accounts
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view their own stripe account" ON stripe_accounts;

CREATE POLICY "Users view own stripe account"
ON stripe_accounts
FOR SELECT
USING (user_id = (select auth.uid()));

-- Recarregar configurações
NOTIFY pgrst, 'reload config';
