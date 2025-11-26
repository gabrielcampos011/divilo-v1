-- Allow servico_id to be NULL for custom services
ALTER TABLE grupos
ALTER COLUMN servico_id DROP NOT NULL;

-- Add a check constraint to ensure either servico_id OR servico_personalizado_nome is set
ALTER TABLE grupos
ADD CONSTRAINT grupos_servico_check
CHECK (
    (servico_id IS NOT NULL AND servico_personalizado_nome IS NULL) OR
    (servico_id IS NULL AND servico_personalizado_nome IS NOT NULL)
);
