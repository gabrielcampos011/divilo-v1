"use client";

import { useState } from "react";
import { removeMemberByLeader } from "@/app/actions/membership";
import { toast } from "sonner";

interface RemoveMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    memberId: string;
    groupId: string;
    memberName: string;
}

export function RemoveMemberDialog({ isOpen, onClose, memberId, groupId, memberName }: RemoveMemberDialogProps) {
    const [loading, setLoading] = useState(false);
    const [justCause, setJustCause] = useState(false);

    if (!isOpen) return null;

    const handleRemove = async () => {
        setLoading(true);
        try {
            const result = await removeMemberByLeader(memberId, groupId, justCause);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Membro removido com sucesso.");
                onClose();
            }
        } catch (error) {
            console.error("Erro ao remover membro:", error);
            toast.error("Erro ao remover membro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-xl border border-gray-100 dark:border-gray-800 m-4 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remover Membro?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tem certeza que deseja remover <span className="font-bold text-gray-900 dark:text-white">{memberName}</span> do grupo?
                </p>

                <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={justCause}
                            onChange={(e) => setJustCause(e.target.checked)}
                            className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 border-gray-300"
                        />
                        <div>
                            <span className="font-bold text-gray-900 dark:text-white block">Justa Causa (Falta de Pagamento)</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Se marcado, a remoção é imediata e não há devolução de valores.
                            </span>
                        </div>
                    </label>
                </div>

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
