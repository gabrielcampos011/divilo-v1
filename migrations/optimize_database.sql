-- Índices para acelerar joins frequentes (Dashboard e Detalhes)
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON membros(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_grupo_id ON membros(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupos_lider_id ON grupos(lider_id);
CREATE INDEX IF NOT EXISTS idx_grupos_servico_id ON grupos(servico_id);

-- Índice para busca textual (future-proofing para barra de busca)
CREATE INDEX IF NOT EXISTS idx_grupos_titulo_gin ON grupos USING gin(to_tsvector('portuguese', titulo || ' ' || coalesce(descricao, '')));
