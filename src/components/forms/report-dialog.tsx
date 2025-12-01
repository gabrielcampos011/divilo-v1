"use client";

import { useState } from "react";
import { createReport } from "@/app/actions/report";
import { toast } from "sonner";
import { AlertTriangle, Flag } from "lucide-react";

interface ReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    groupTitle: string;
}

export function ReportDialog({ isOpen, onClose, groupId, groupTitle }: ReportDialogProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const result = await createReport(formData);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(result.success);
                onClose();
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
                <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <Flag className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Denunciar Grupo</h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Você está denunciando o grupo <span className="font-bold text-gray-900 dark:text-white">{groupTitle}</span>.
                    Sua denúncia será analisada anonimamente pela nossa equipe.
                </p>

                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="group_id" value={groupId} />

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Motivo
                        </label>
                        <select
                            name="reason"
                            id="reason"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        >
                            <option value="">Selecione um motivo...</option>
                            <option value="scam">Golpe / Fraude</option>
                            <option value="abuse">Comportamento Abusivo</option>
                            <option value="inactive">Grupo Inativo / Líder Ausente</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descrição (Opcional)
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                            placeholder="Descreva o problema com mais detalhes..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-bold flex items-center gap-2 shadow-lg shadow-red-900/20"
                        >
                            {loading ? "Enviando..." : "Enviar Denúncia"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
