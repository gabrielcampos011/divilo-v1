-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges (Public read)
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges FOR SELECT 
USING (true);

-- Policies for user_badges (Public read)
CREATE POLICY "User badges are viewable by everyone" 
ON public.user_badges FOR SELECT 
USING (true);

-- Seed initial badges
INSERT INTO public.badges (slug, name, description, icon_name) VALUES
('pioneiro', 'Pioneiro', 'Um dos primeiros membros do Divilo.', 'Rocket'),
('lider', 'Líder', 'Gerencia um ou mais grupos.', 'Crown'),
('membro-ativo', 'Membro Ativo', 'Participa ativamente de grupos.', 'Star'),
('verificado', 'Verificado', 'Identidade confirmada.', 'ShieldCheck')
ON CONFLICT (slug) DO NOTHING;
