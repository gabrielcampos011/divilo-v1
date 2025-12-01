-- Garante que o usuário veja suas próprias notificações
DROP POLICY IF EXISTS "View Own Notifications" ON public.notificacoes;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notificacoes;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notificacoes;

CREATE POLICY "View Own Notifications" ON public.notificacoes
FOR SELECT USING (user_id = (select auth.uid()));

-- Garante que o sistema/líder possa inserir notificações para outros
DROP POLICY IF EXISTS "Insert Notifications" ON public.notificacoes;
DROP POLICY IF EXISTS "Final Insert Notificacoes" ON public.notificacoes;
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notificacoes;

CREATE POLICY "Insert Notifications" ON public.notificacoes
FOR INSERT WITH CHECK (true); -- Permissivo para inserção interna

-- Garante que o usuário possa atualizar suas próprias notificações (marcar como lida)
DROP POLICY IF EXISTS "Update Own Notifications" ON public.notificacoes;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notificacoes;

CREATE POLICY "Update Own Notifications" ON public.notificacoes
FOR UPDATE USING (user_id = (select auth.uid()));

