'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Voluntary Exit
export async function leaveGroup(groupId: string, exitType: 'immediate' | 'scheduled') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Usuário não autenticado." };
    }

    if (exitType === 'immediate') {
        // Immediate exit: Remove member record or mark as removed
        // For MVP, we'll delete the record to free up the spot immediately, 
        // OR update status to 'removido' if we want to keep history.
        // Let's delete for now to keep it simple and consistent with "opening a spot".
        const { error } = await supabase
            .from("membros")
            .delete()
            .eq("grupo_id", groupId)
            .eq("user_id", user.id);

        if (error) return { error: "Erro ao sair do grupo." };
    } else {
        // Scheduled exit: Set date to 30 days from now
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 30);

        const { error } = await supabase
            .from("membros")
            .update({ data_saida_agendada: scheduledDate.toISOString() })
            .eq("grupo_id", groupId)
            .eq("user_id", user.id);

        if (error) return { error: "Erro ao agendar saída." };
    }

    revalidatePath(`/grupos/${groupId}`);
    revalidatePath("/dashboard");
    return { success: true };
}

// Leader Removal
export async function removeMemberByLeader(memberId: string, groupId: string, justCause: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Usuário não autenticado." };

    // Verify if user is leader (RLS should handle this, but good to double check or rely on RLS)
    // We'll rely on RLS for the delete/update operation, but we might need to check logic for refunds later.

    if (justCause) {
        // Immediate removal
        const { error } = await supabase
            .from("membros")
            .delete()
            .eq("id", memberId)
            .eq("grupo_id", groupId); // Ensure group matches

        if (error) return { error: "Erro ao remover membro." };
    } else {
        // No just cause - In a real app, this would trigger a refund flow.
        // For MVP, we still remove, but maybe we should log it or notify.
        // For now, we'll treat it as immediate removal but technically the leader "should" refund.
        const { error } = await supabase
            .from("membros")
            .delete()
            .eq("id", memberId)
            .eq("grupo_id", groupId);

        if (error) return { error: "Erro ao remover membro." };
    }

    revalidatePath(`/lider/grupos/${groupId}`);
    return { success: true };
}
