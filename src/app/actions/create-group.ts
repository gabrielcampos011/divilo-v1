'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
    const supabase = await createClient();

    // 1. Validate Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 2. Extract Data
    const titulo = formData.get("titulo") as string;
    const servico_id = formData.get("servico_id") as string;
    const vagas_totais = parseInt(formData.get("vagas_totais") as string);
    const valor_cota = parseFloat((formData.get("valor_cota") as string).replace("R$", "").replace(".", "").replace(",", "."));

    const pix_key = formData.get("pix_key") as string;
    const login_acesso = formData.get("login_acesso") as string;
    const senha_acesso = formData.get("senha_acesso") as string;

    // Basic Validation
    if (!titulo || !servico_id || !vagas_totais || !pix_key || !login_acesso || !senha_acesso) {
        // In a real app, return error state
        throw new Error("Campos obrigatórios faltando");
    }

    // 3. Insert Group (Parent)
    const { data: grupo, error: grupoError } = await supabase
        .from("grupos")
        .insert({
            lider_id: user.id,
            servico_id,
            titulo,
            vagas_totais,
            vagas_ocupadas: 0, // Starts empty (or 1 if leader is member? logic says leader is owner, usually not occupying a slot unless they add themselves)
            valor_cota
        })
        .select()
        .single();

    if (grupoError) {
        console.error("Erro ao criar grupo:", grupoError);
        throw new Error("Erro ao criar grupo");
    }

    const grupoId = grupo.id;

    // 4. Insert Sensitive Data
    // Pix
    const { error: pixError } = await supabase
        .from("grupos_pix")
        .insert({
            grupo_id: grupoId,
            pix_key
        });

    if (pixError) {
        console.error("Erro ao salvar Pix:", pixError);
        // Rollback logic would go here (delete group)
    }

    // Credentials
    const { error: acessoError } = await supabase
        .from("grupos_acesso")
        .insert({
            grupo_id: grupoId,
            login_acesso,
            senha_acesso
        });

    if (acessoError) {
        console.error("Erro ao salvar credenciais:", acessoError);
    }

    // 5. Revalidate & Redirect
    revalidatePath("/lider");
    redirect("/lider");
}
