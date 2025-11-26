-- Migration: Add group details and member exit management
-- Adds columns for contact, description, rules, FAQ to grupos table
-- Adds exit date tracking to membros table

-- Add columns to grupos table
ALTER TABLE grupos
ADD COLUMN IF NOT EXISTS contato_lider TEXT,
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS regras TEXT,
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;

-- Add column to membros table
ALTER TABLE membros
ADD COLUMN IF NOT EXISTS data_saida_solicitada TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN grupos.contato_lider IS 'WhatsApp/Email do líder (visível apenas após pagamento)';
COMMENT ON COLUMN grupos.descricao IS 'Descrição detalhada do grupo';
COMMENT ON COLUMN grupos.regras IS 'Regras do grupo';
COMMENT ON COLUMN grupos.faq IS 'FAQ em formato JSON: [{"p": "pergunta", "r": "resposta"}]';
COMMENT ON COLUMN membros.data_saida_solicitada IS 'Data de solicitação de saída (aviso prévio de 30 dias)';
