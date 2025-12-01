'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveMember(memberId: string, grupoId: string) {
    const supabase = await createClient();

    // 1. Validate Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Não autorizado");
    }

    // 2. Verify Leadership (Security)
    // Check if the current user is the leader of the group this member belongs to
    const { data: grupo } = await supabase
        .from("grupos")
        .select("lider_id, titulo")
        .eq("id", grupoId)
        .single();

    if (!grupo || grupo.lider_id !== user.id) {
        throw new Error("Você não tem permissão para gerenciar este grupo");
    }

    // 3. Update Status
    const { error } = await supabase
        .from("membros")
        .update({ status: "aprovado" })
        .eq("id", memberId);

    if (error) {
        console.error("Erro ao aprovar membro:", error);
        throw new Error("Erro ao aprovar membro");
    }

    // Notify Member
    const { data: member } = await supabase
        .from("membros")
        .select("user_id")
        .eq("id", memberId)
        .single();

    if (member) {
        await supabase.from("notificacoes").insert({
            user_id: member.user_id,
            mensagem: `Sua entrada no grupo ${grupo.titulo} foi aprovada! Realize o pagamento.`,
            tipo: "aprovacao",
            link: `/grupos/${grupoId}`
        });
    }

    // 4. Revalidate
    revalidatePath(`/lider/grupos/${grupoId}`);
}
