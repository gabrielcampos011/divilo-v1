BEGIN; -- Inicia a transação. Se algo falhar, nada é aplicado.



-- =================================================================
-- 1. TABELA GRUPOS (Reset Completo)
-- =================================================================



-- Derrubar TODAS as políticas existentes conhecidas para evitar conflitos

DROP POLICY IF EXISTS "Leader full access grupos" ON public.grupos;

DROP POLICY IF EXISTS "Public read grupos" ON public.grupos;

DROP POLICY IF EXISTS "Authenticated users can select groups" ON public.grupos;

DROP POLICY IF EXISTS "Leader modify grupos" ON public.grupos;

DROP POLICY IF EXISTS "Leader delete grupos" ON public.grupos;

DROP POLICY IF EXISTS "Leader insert grupos" ON public.grupos;

DROP POLICY IF EXISTS "Public Read Grupos" ON public.grupos;



-- REGRAS DEFINITIVAS:



-- A. Leitura: PÚBLICA (Catálogo e Relacionamentos)

-- Isso corrige o problema de "Meus Grupos" sumindo, pois permite o JOIN

CREATE POLICY "Public Read Grupos"

ON public.grupos FOR SELECT

USING (true);



-- B. Escrita: Apenas o LÍDER (dono do grupo)

CREATE POLICY "Leader Insert Grupos"

ON public.grupos FOR INSERT

WITH CHECK (lider_id = (select auth.uid()));



CREATE POLICY "Leader Update Grupos"

ON public.grupos FOR UPDATE

USING (lider_id = (select auth.uid()));



CREATE POLICY "Leader Delete Grupos"

ON public.grupos FOR DELETE

USING (lider_id = (select auth.uid()));




-- =================================================================

-- 2. TABELA MEMBROS (Reset Completo)

-- =================================================================



-- Derrubar TODAS as políticas antigas

DROP POLICY IF EXISTS "Unified view policy for members" ON public.membros;

DROP POLICY IF EXISTS "Unified update policy for leaders" ON public.membros;

DROP POLICY IF EXISTS "User create membership optimized" ON public.membros;

DROP POLICY IF EXISTS "Unified delete policy (User or Leader)" ON public.membros;

DROP POLICY IF EXISTS "Final Optimized Insert Membros" ON public.membros;

DROP POLICY IF EXISTS "Final Optimized Delete Membros" ON public.membros;

DROP POLICY IF EXISTS "User create membership" ON public.membros;

DROP POLICY IF EXISTS "User delete own membership" ON public.membros;

DROP POLICY IF EXISTS "View Members Policy" ON public.membros;

DROP POLICY IF EXISTS "Unified View Policy for Members (Fixed)" ON public.membros;



-- REGRAS DEFINITIVAS:



-- A. Visualização (Quem vê quem?)

CREATE POLICY "View Members Policy"

ON public.membros FOR SELECT

USING (

  -- 1. Eu vejo a mim mesmo (CRÍTICO para 'Meus Grupos')

  user_id = (select auth.uid()) 

  OR 

  -- 2. O Líder vê todos do seu grupo

  EXISTS (

    SELECT 1 FROM grupos 

    WHERE id = membros.grupo_id 

    AND lider_id = (select auth.uid())

  )

  OR

  -- 3. Membros Ativos vêem uns aos outros (Social - Aprovados ou Pagos)

  (

    status IN ('aprovado', 'pago') 

    AND 

    EXISTS (

      SELECT 1 FROM membros as m2

      WHERE m2.grupo_id = membros.grupo_id

      AND m2.user_id = (select auth.uid())

      AND m2.status IN ('aprovado', 'pago')

    )

  )

);



-- B. Entrada (Solicitação)

CREATE POLICY "User Request Entry"

ON public.membros FOR INSERT

WITH CHECK (

  user_id = (select auth.uid()) -- Só posso me inserir a mim mesmo

);



-- C. Atualização (Líder Aprova/Bane)

CREATE POLICY "Leader Update Status"

ON public.membros FOR UPDATE

USING (

  EXISTS (

    SELECT 1 FROM grupos 

    WHERE id = membros.grupo_id 

    AND lider_id = (select auth.uid())

  )

);



-- D. Saída (Eu saio OU Líder me tira)

CREATE POLICY "Delete Membership"

ON public.membros FOR DELETE

USING (

  user_id = (select auth.uid()) 

  OR 

  EXISTS ( 

    SELECT 1 FROM grupos 

    WHERE id = membros.grupo_id 

    AND lider_id = (select auth.uid())

  )

);



COMMIT; -- Confirma a transação. Só chega aqui se tudo acima funcionou.


