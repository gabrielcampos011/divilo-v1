"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { toast } from "sonner";

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const result = await updatePassword(formData);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(result.success);
                // Reset form
                const form = document.getElementById("change-password-form") as HTMLFormElement;
                form.reset();
            }
        } catch (e) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 p-1 rounded-lg text-sm">🔒</span>
                Alterar Senha
            </h3>

            <form id="change-password-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nova Senha
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        minLength={6}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? "Atualizando..." : "Atualizar Senha"}
                </button>
            </form>
        </div>
    );
}
