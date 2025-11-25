-- ============================================
-- Migração: Hierarquia de Serviços (Marca -> Plano)
-- Data: 2025-11-25
-- Descrição: Adiciona colunas para suportar agrupamento de planos por marca
-- ============================================

-- Passo 1: Adicionar novas colunas à tabela servicos
ALTER TABLE servicos
ADD COLUMN IF NOT EXISTS grupo_servico text,        -- Nome da Marca (ex: 'Spotify')
ADD COLUMN IF NOT EXISTS nome_plano text,           -- Nome do Plano (ex: 'Família', 'Duo')
ADD COLUMN IF NOT EXISTS nome_completo text,        -- Nome completo para busca (ex: 'Spotify | Família')
ADD COLUMN IF NOT EXISTS valor_por_membro_divilo numeric(10,2), -- Preço final por membro
ADD COLUMN IF NOT EXISTS categoria text;            -- Categoria: 'Video', 'Música', etc.

-- Passo 2: Criar índice para busca rápida por grupo_servico
CREATE INDEX IF NOT EXISTS idx_servicos_grupo ON servicos(grupo_servico);

-- Passo 3: Criar índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);

-- Passo 4: Adicionar constraint para garantir que nome_completo seja único
-- Nota: Usamos DO $$ para verificar se a constraint já existe antes de criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'servicos_nome_completo_unique'
    ) THEN
        ALTER TABLE servicos
        ADD CONSTRAINT servicos_nome_completo_unique UNIQUE (nome_completo);
    END IF;
END $$;

-- ============================================
-- Verificação da Migração
-- ============================================

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'servicos' 
  AND column_name IN ('grupo_servico', 'nome_plano', 'nome_completo', 'valor_por_membro_divilo', 'categoria');

-- Verificar índices criados
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'servicos' 
  AND indexname IN ('idx_servicos_grupo', 'idx_servicos_categoria');
