'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function confirmPayment(memberId: string, grupoId: string) {
    const supabase = await createClient();

    // 1. Validate Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Não autorizado");
    }

    // 2. Verify Leadership
    const { data: grupo } = await supabase
        .from("grupos")
        .select("lider_id")
        .eq("id", grupoId)
        .single();

    if (!grupo || grupo.lider_id !== user.id) {
        throw new Error("Você não tem permissão para gerenciar este grupo");
    }

    // 3. Update Status
    const { error } = await supabase
        .from("membros")
        .update({ status: "pago" })
        .eq("id", memberId);

    if (error) {
        console.error("Erro ao confirmar pagamento:", error);
        throw new Error("Erro ao confirmar pagamento");
    }

    revalidatePath(`/lider/grupos/${grupoId}`);
}

export async function removeMember(memberId: string, grupoId: string) {
    const supabase = await createClient();

    // 1. Validate Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Não autorizado");
    }

    // 2. Verify Leadership
    const { data: grupo } = await supabase
        .from("grupos")
        .select("lider_id")
        .eq("id", grupoId)
        .single();

    if (!grupo || grupo.lider_id !== user.id) {
        throw new Error("Você não tem permissão para gerenciar este grupo");
    }

    // 3. Delete Member (Trigger will handle vacancy count)
    const { error } = await supabase
        .from("membros")
        .delete()
        .eq("id", memberId);

    if (error) {
        console.error("Erro ao remover membro:", error);
        throw new Error("Erro ao remover membro");
    }

    revalidatePath(`/lider/grupos/${grupoId}`);
}
