"use client";

import { useState } from "react";
import { leaveGroup } from "@/app/actions/membership";
import { toast } from "sonner";
import { AlertTriangle, Calendar, LogOut } from "lucide-react";

interface LeaveGroupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    groupTitle: string;
    hasCaucao: boolean;
}

export function LeaveGroupDialog({ isOpen, onClose, groupId, groupTitle, hasCaucao }: LeaveGroupDialogProps) {
    const [loading, setLoading] = useState(false);
    const [exitType, setExitType] = useState<'immediate' | 'scheduled'>('scheduled');

    if (!isOpen) return null;

    async function handleLeave() {
        setLoading(true);
        try {
            const result = await leaveGroup(groupId, exitType);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(exitType === 'immediate' ? "Você saiu do grupo." : "Saída agendada com sucesso.");
                onClose();
                // Optional: redirect to dashboard
                window.location.href = "/dashboard";
            }
        } catch (e) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-xl border border-gray-100 dark:border-gray-800 m-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <LogOut className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sair do Grupo</h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Você está saindo de <span className="font-bold text-gray-900 dark:text-white">{groupTitle}</span>.
                    Escolha como deseja prosseguir:
                </p>

                <div className="space-y-4 mb-8">
                    {/* Option 1: Scheduled */}
                    <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${exitType === 'scheduled' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="exitType"
                                value="scheduled"
                                checked={exitType === 'scheduled'}
                                onChange={() => setExitType('scheduled')}
                                className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500"
                            />
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white block mb-1">Agendar Saída (30 dias)</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Você continua no grupo por mais 30 dias.
                                    {hasCaucao && <span className="text-green-600 dark:text-green-400 font-bold block mt-1">✓ Seu caução será devolvido.</span>}
                                </span>
                            </div>
                        </div>
                    </label>

                    {/* Option 2: Immediate */}
                    <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${exitType === 'immediate' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="exitType"
                                value="immediate"
                                checked={exitType === 'immediate'}
                                onChange={() => setExitType('immediate')}
                                className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500"
                            />
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white block mb-1">Sair Agora</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Você perde o acesso imediatamente.
                                    {hasCaucao && <span className="text-red-600 dark:text-red-400 font-bold block mt-1">⚠ Você perderá o caução por sair sem aviso prévio.</span>}
                                </span>
                            </div>
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
                        onClick={handleLeave}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl transition-colors font-bold"
                    >
                        {loading ? "Processando..." : "Confirmar Saída"}
                    </button>
                </div>
            </div>
        </div>
    );
}
