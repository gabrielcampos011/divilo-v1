"use client";

import { useState, useEffect } from "react";
import { Service } from "./service-brand-selector";
import { createGroup } from "@/app/actions/create-group";

interface GroupConfigFormProps {
    selectedPlan: Service;
    onBack: () => void;
}

export function GroupConfigForm({ selectedPlan, onBack }: GroupConfigFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        vagas_totais: "5",
        valor_cota: "",
        pix_key: "",
        contato_lider: "",
        login_acesso: "",
        senha_acesso: "",
    });

    // Pre-fill form based on selected plan
    useEffect(() => {
        if (selectedPlan) {
            setFormData(prev => ({
                ...prev,
                titulo: `${selectedPlan.nome_completo}`,
                vagas_totais: selectedPlan.max_vagas_padrao?.toString() || "5",
                valor_cota: selectedPlan.valor_por_membro_divilo?.toFixed(2).replace('.', ',') || ""
            }));
        }
    }, [selectedPlan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("servico_id", selectedPlan.id);
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            await createGroup(data);
        } catch (error) {
            console.error(error);
            alert("Erro ao criar grupo. Tente novamente.");
            setLoading(false);
        }
    };

    // Generate slots options based on max_vagas_padrao
    const maxSlots = selectedPlan.max_vagas_padrao || 6;
    const slotOptions = Array.from({ length: maxSlots - 1 }, (_, i) => i + 2); // Start from 2 up to max

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    Configurar Grupo
                </h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Título do Grupo</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Vagas Totais</label>
                        <select
                            name="vagas_totais"
                            value={formData.vagas_totais}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        >
                            {slotOptions.map(num => (
                                <option key={num} value={num}>{num} Vagas</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Valor da Cota (Mensal)</label>
                        <input
                            type="text"
                            name="valor_cota"
                            value={formData.valor_cota}
                            onChange={handleChange}
                            placeholder="R$ 0,00"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900 p-4 rounded-xl flex gap-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                        <h3 className="font-bold text-yellow-800 dark:text-yellow-400">Dados Protegidos</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-500">
                            Estas informações só serão reveladas para membros que tiverem o pagamento confirmado por você.
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Chave Pix (para receber)</label>
                    <input
                        type="text"
                        name="pix_key"
                        value={formData.pix_key}
                        onChange={handleChange}
                        placeholder="CPF, Email ou Aleatória"
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Contato do Líder (WhatsApp/Email)</label>
                    <input
                        type="text"
                        name="contato_lider"
                        value={formData.contato_lider}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999 ou email@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visível apenas para membros com pagamento confirmado</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Login do Serviço</label>
                        <input
                            type="text"
                            name="login_acesso"
                            value={formData.login_acesso}
                            onChange={handleChange}
                            placeholder="email@exemplo.com"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Senha do Serviço</label>
                        <input
                            type="text"
                            name="senha_acesso"
                            value={formData.senha_acesso}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !formData.pix_key || !formData.login_acesso || !formData.senha_acesso}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    {loading ? "Criando..." : "Finalizar e Criar Grupo"}
                </button>
            </div>
        </form>
    );
}
