"use client";

import { useState } from "react";
import { removeMember } from "@/app/actions/manage-payment";

interface RemoveMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    memberId: string;
    groupId: string;
    memberName: string;
}

export function RemoveMemberDialog({ isOpen, onClose, memberId, groupId, memberName }: RemoveMemberDialogProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleRemove = async () => {
        setLoading(true);
        try {
            await removeMember(memberId, groupId);
            onClose();
        } catch (error) {
            console.error("Erro ao remover membro:", error);
            alert("Erro ao remover membro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 dark:border-gray-800 m-4 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remover Membro?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tem certeza que deseja remover <span className="font-bold text-gray-900 dark:text-white">{memberName}</span> do grupo?
                    Esta ação não pode ser desfeita e o usuário perderá acesso às credenciais.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRemove}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold flex items-center gap-2"
                    >
                        {loading ? "Removendo..." : "Sim, Remover"}
                    </button>
                </div>
            </div>
        </div>
    );
}
