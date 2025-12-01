'use server'

import { createClient } from "@/utils/supabase/server";

export async function createReport(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Você precisa estar logado para denunciar." };
    }

    const group_id = formData.get("group_id") as string;
    const reason = formData.get("reason") as string;
    const description = formData.get("description") as string;

    if (!group_id || !reason) {
        return { error: "Campos obrigatórios faltando." };
    }

    const { error } = await supabase
        .from("reports")
        .insert({
            reporter_id: user.id,
            group_id,
            reason,
            description,
            status: 'pending'
        });

    if (error) {
        console.error("Erro ao criar denúncia:", error);
        return { error: "Erro ao enviar denúncia. Tente novamente." };
    }

    return { success: "Denúncia enviada com sucesso. Nossa equipe irá analisar." };
}
