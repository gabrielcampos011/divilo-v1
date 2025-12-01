-- 1. PERFORMANCE: Criação de Índices Faltantes
-- Resolve alertas de 'unindexed_foreign_keys'
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON public.notificacoes(user_id);

-- Tabela reports não existe ainda no banco de produção, removido índices para evitar erro.
-- CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
-- CREATE INDEX IF NOT EXISTS idx_reports_group_id ON public.reports(group_id);

-- 2. OTIMIZAÇÃO RLS: Cache de Auth (InitPlan)
-- Substitui chamadas diretas por (select auth.uid()) para evitar reavaliação por linha

-- Tabela: Grupos
DROP POLICY IF EXISTS "Leader full access grupos" ON grupos;
CREATE POLICY "Leader full access grupos"
ON grupos
FOR ALL
USING (lider_id = (select auth.uid()));

-- 3. REFATORAÇÃO RLS: Unificação de Políticas (Membros)
-- Resolve o alerta 'multiple_permissive_policies' combinando lógicas em uma única query otimizada

-- Remover políticas antigas fragmentadas (limpeza)
DROP POLICY IF EXISTS "Leader view group requests" ON membros;
DROP POLICY IF EXISTS "Leaders can view all members of their groups" ON membros;
DROP POLICY IF EXISTS "Members can view other members of their group" ON membros;
DROP POLICY IF EXISTS "User view own memberships" ON membros;
DROP POLICY IF EXISTS "Users can view their own membership" ON membros;

-- Criar Política Unificada de Visualização (SELECT)
CREATE POLICY "Unified view policy for members"
ON membros FOR SELECT
USING (
  -- 1. O próprio usuário vê sua linha
  user_id = (select auth.uid()) 
  OR 
  -- 2. O líder do grupo vê a linha
  EXISTS (
    SELECT 1 FROM grupos 
    WHERE id = membros.grupo_id 
    AND lider_id = (select auth.uid())
  )
  OR
  -- 3. Outros membros APROVADOS/PAGOS do mesmo grupo veem a linha (Social)
  (
    status IN ('aprovado', 'pago') 
    AND 
    EXISTS (
      SELECT 1 FROM membros as m2
      WHERE m2.grupo_id = membros.grupo_id
      AND m2.user_id = (select auth.uid())
      AND m2.status IN ('aprovado', 'pago')
    )
  )
);

-- Recarregar configurações do PostgREST
NOTIFY pgrst, 'reload config';
