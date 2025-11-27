-- Clean up duplicate members and add unique constraint

-- 1. Remove duplicate rows, keeping the oldest 'aprovado' or 'pago' one, or the oldest 'pendente' if no approved exists
DELETE FROM membros a USING membros b
WHERE a.id > b.id 
AND a.grupo_id = b.grupo_id 
AND a.user_id = b.user_id;

-- 2. Add a unique constraint to prevent future duplicates
ALTER TABLE membros
ADD CONSTRAINT membros_grupo_id_user_id_key UNIQUE (grupo_id, user_id);

-- 3. Update vagas_ocupadas to reflect the real count
UPDATE grupos g
SET vagas_ocupadas = (
    SELECT COUNT(*)
    FROM membros m
    WHERE m.grupo_id = g.id
    AND m.status IN ('aprovado', 'pago')
);
