-- Create notificacoes table
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    tipo TEXT NOT NULL, -- 'solicitacao', 'aprovacao', 'sistema'
    link TEXT, -- Optional link to redirect
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON notificacoes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: System/Actions can insert notifications (usually via service role or triggers, but for now allow authenticated users to insert if logic requires it, though ideally backend handles this)
-- For simplicity in this prototype, we'll allow authenticated users to insert (e.g. a user requesting entry triggers a notification insert for the leader)
CREATE POLICY "Users can insert notifications" 
ON notificacoes FOR INSERT 
WITH CHECK (true); 

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
ON notificacoes FOR UPDATE 
USING (auth.uid() = user_id);
