-- Add RLS policies for grupos_acesso and grupos_pix tables
-- This allows members to view service credentials and payment info

-- Enable RLS on grupos_acesso if not already enabled
ALTER TABLE grupos_acesso ENABLE ROW LEVEL SECURITY;

-- Enable RLS on grupos_pix if not already enabled
ALTER TABLE grupos_pix ENABLE ROW LEVEL SECURITY;

-- Allow leaders to manage their group's access credentials
CREATE POLICY "Leaders can manage their group access"
ON grupos_acesso FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM grupos
        WHERE grupos.id = grupos_acesso.grupo_id
        AND grupos.lider_id = auth.uid()
    )
);

-- Allow paid members to view access credentials
CREATE POLICY "Paid members can view access credentials"
ON grupos_acesso FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM membros
        WHERE membros.grupo_id = grupos_acesso.grupo_id
        AND membros.user_id = auth.uid()
        AND membros.status = 'pago'
    )
);

-- Allow leaders to manage their group's PIX info
CREATE POLICY "Leaders can manage their group PIX"
ON grupos_pix FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM grupos
        WHERE grupos.id = grupos_pix.grupo_id
        AND grupos.lider_id = auth.uid()
    )
);

-- Allow approved members to view PIX for payment
CREATE POLICY "Approved members can view PIX"
ON grupos_pix FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM membros
        WHERE membros.grupo_id = grupos_pix.grupo_id
        AND membros.user_id = auth.uid()
        AND membros.status IN ('aprovado', 'pago')
    )
);
