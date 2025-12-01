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

    if (!user.email_confirmed_at) {
        // Optional: Trigger resend email here if needed, or just block
        throw new Error("Você precisa confirmar seu email antes de criar um grupo.");
    }

    // 2. Extract Data
    const titulo = formData.get("titulo") as string;
    const servico_id = formData.get("servico_id") as string;
    const vagas_totais = parseInt(formData.get("vagas_totais") as string);
    const valor_cota = parseFloat((formData.get("valor_cota") as string).replace("R$", "").replace(".", "").replace(",", "."));

    const pix_key = formData.get("pix_key") as string;
    const contato_lider = formData.get("contato_lider") as string;
    const login_acesso = formData.get("login_acesso") as string;
    const senha_acesso = formData.get("senha_acesso") as string;

    // New competitive features
    const tem_caucao = formData.get("tem_caucao") === "true";
    const valor_caucao = tem_caucao ? parseFloat((formData.get("valor_caucao") as string).replace("R$", "").replace(".", "").replace(",", ".")) : 0;
    const fidelidade_meses = parseInt(formData.get("fidelidade_meses") as string) || 0;

    // Custom service name (only if servico_id is CUSTOM)
    const servico_personalizado_nome = servico_id === 'CUSTOM' ? titulo : null;

    // Basic Validation (allow CUSTOM for servico_id)
    if (!titulo || !vagas_totais || !pix_key || !login_acesso || !senha_acesso) {
        throw new Error("Campos obrigatórios faltando");
    }

    // For custom services, servico_id will be null
    const finalServicoId = servico_id === 'CUSTOM' ? null : servico_id;

    // 3. Insert Group (Parent)
    const { data: grupo, error: grupoError } = await supabase
        .from("grupos")
        .insert({
            lider_id: user.id,
            servico_id: finalServicoId,
            titulo,
            vagas_totais,
            vagas_ocupadas: 0,
            valor_cota,
            contato_lider,
            tem_caucao,
            valor_caucao,
            fidelidade_meses,
            servico_personalizado_nome
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
