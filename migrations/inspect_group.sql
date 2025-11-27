-- Inspect group capacity and members
SELECT 
    g.id, 
    g.titulo, 
    g.vagas_totais, 
    g.vagas_ocupadas,
    (SELECT COUNT(*) FROM membros m WHERE m.grupo_id = g.id AND m.status IN ('aprovado', 'pago')) as real_ocupadas,
    (SELECT COUNT(*) FROM membros m WHERE m.grupo_id = g.id) as total_membros_registrados
FROM grupos g
WHERE g.id = '269f1dfb-ffa8-4efe-9e16-2a5179250de1';

-- List members of the group
SELECT id, user_id, status FROM membros WHERE grupo_id = '269f1dfb-ffa8-4efe-9e16-2a5179250de1';
