-- Enable Realtime for notificacoes table
-- This allows the frontend to receive instant updates when new notifications are inserted
ALTER PUBLICATION supabase_realtime ADD TABLE notificacoes;
