-- 1. Proteger Trigger de Novo Usuário
ALTER FUNCTION public.create_profile_on_signup() 
SET search_path = public;

-- 2. Proteger Trigger de Vagas
ALTER FUNCTION public.handle_vacancy_change() 
SET search_path = public;

-- 3. Proteger Helper de RLS (Assumindo assinatura padrão com UUID)
-- Nota: Se esta função tiver outra assinatura, o comando falhará e precisaremos ajustar.
DO $$
BEGIN
    -- Tenta aplicar a alteração assumindo que recebe um UUID (padrão do Divilo)
    BEGIN
        ALTER FUNCTION public.is_member_of_group(uuid) SET search_path = public;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'A função is_member_of_group(uuid) não foi encontrada ou tem outra assinatura. Verifique manualmente.';
    END;
END $$;

-- Recarregar configurações
NOTIFY pgrst, 'reload config';
