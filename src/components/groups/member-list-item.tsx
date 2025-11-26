"use client";

import { useState } from "react";
import { ConfirmPaymentButton } from "@/components/ui/confirm-payment-button";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { Trash2, User, CheckCircle, Clock } from "lucide-react";

interface MemberListItemProps {
    member: {
        id: string;
        user_id: string;
        status: string;
        data_solicitacao: string;
        profiles?: { full_name: string; avatar_url: string } | null;
    };
    groupId: string;
}

export function MemberListItem({ member, groupId }: MemberListItemProps) {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    // Use profile name if available, otherwise fallback to ID
    const displayName = member.profiles?.full_name || `Usuário #${member.user_id.slice(0, 8)}`;
    const displayDate = new Date(member.data_solicitacao).toLocaleDateString();

    return (
        <>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold shrink-0 overflow-hidden">
                        {member.profiles?.avatar_url ? (
                            <img src={member.profiles.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{displayName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Entrou em {displayDate}</span>
                            <span>•</span>
                            <span className={`capitalize ${member.status === 'pago' ? 'text-green-600 dark:text-green-400' :
                                    member.status === 'aprovado' ? 'text-yellow-600 dark:text-yellow-400' : ''
                                }`}>
                                {member.status === 'pago' ? 'Ativo' : 'Aguardando Pagamento'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    {member.status === 'pago' ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Pago
                        </span>
                    ) : (
                        <ConfirmPaymentButton memberId={member.id} groupId={groupId} />
                    )}

                    <button
                        onClick={() => setIsRemoveDialogOpen(true)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Remover Membro"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <RemoveMemberDialog
                isOpen={isRemoveDialogOpen}
                onClose={() => setIsRemoveDialogOpen(false)}
                memberId={member.id}
                groupId={groupId}
                memberName={displayName}
            />
        </>
    );
}
