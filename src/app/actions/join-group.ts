'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function requestEntry(grupoId: string) {
    const supabase = await createClient();

    // 1. Validate Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 2. Check if already a member (any status)
    const { data: existingMember } = await supabase
        .from("membros")
        .select("status")
        .eq("grupo_id", grupoId)
        .eq("user_id", user.id)
        .single();

    if (existingMember) {
        return { message: "Você já solicitou entrada neste grupo." };
    }

    // 3. Check vacancies (Optional, trigger handles it but good for UX)
    const { data: grupo } = await supabase
        .from("grupos")
        .select("vagas_totais, vagas_ocupadas")
        .eq("id", grupoId)
        .single();

    if (grupo && grupo.vagas_ocupadas >= grupo.vagas_totais) {
        return { error: "Este grupo está cheio." };
    }

    // 4. Insert Request
    const { error } = await supabase
        .from("membros")
        .insert({
            grupo_id: grupoId,
            user_id: user.id,
            status: "pendente"
        });

    if (error) {
        console.error("Erro ao solicitar entrada:", error);
        return { error: "Erro ao processar solicitação." };
    }

    revalidatePath(`/grupos/${grupoId}`);
    return { success: true };
}
