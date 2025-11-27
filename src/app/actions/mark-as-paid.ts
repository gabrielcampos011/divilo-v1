"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsPaid(groupId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    // Update member status to 'pago'
    const { error } = await supabase
        .from("membros")
        .update({ status: "pago" })
        .eq("grupo_id", groupId)
        .eq("user_id", user.id)
        .eq("status", "aprovado"); // Only approved members can mark as paid

    if (error) {
        console.error("Erro ao marcar como pago:", error);
        throw new Error("Erro ao atualizar status do pagamento");
    }

    revalidatePath(`/grupos/${groupId}`);
    revalidatePath("/grupos");
}
