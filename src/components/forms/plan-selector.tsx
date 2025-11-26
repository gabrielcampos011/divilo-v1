"use client";

import { Service } from "./service-brand-selector";
import { useState } from "react";

interface PlanSelectorProps {
    services: Service[];
    selectedBrand: string;
    onSelectPlan: (service: Service) => void;
    onCustomService: (serviceName: string, monthlyPrice: number) => void;
    onBack: () => void;
}

export function PlanSelector({ services, selectedBrand, onSelectPlan, onCustomService, onBack }: PlanSelectorProps) {
    const [customName, setCustomName] = useState("");
    const [customPrice, setCustomPrice] = useState("");

    // Filter plans for the selected brand
    const plans = services.filter(s => s.grupo_servico === selectedBrand);

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customName && customPrice) {
            onCustomService(customName, parseFloat(customPrice));
        }
    };

    // If CUSTOM brand, show custom form
    if (selectedBrand === 'CUSTOM') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        Serviço Personalizado
                    </h2>
                </div>

                <form onSubmit={handleCustomSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-100 dark:border-gray-800 p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="serviceName" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Nome do Serviço
                                </label>
                                <input
                                    type="text"
                                    id="serviceName"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="Ex: VPN Particular, Software Empresarial..."
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="monthlyPrice" className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Valor Mensal Total (R$)
                                </label>
                                <input
                                    type="number"
                                    id="monthlyPrice"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    placeholder="Ex: 49.90"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Este é o valor total da assinatura que será dividido entre os membros.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 hover:-translate-y-0.5"
                    >
                        Continuar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    Escolha o plano do {selectedBrand}
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plans.map((plan) => (
                    <button
                        key={plan.id}
                        onClick={() => onSelectPlan(plan)}
                        className="group relative flex flex-col p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-rose-500 dark:hover:border-rose-500 hover:shadow-lg transition-all text-left"
                    >
                        <div className="flex justify-between items-start w-full mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-rose-500 transition-colors">
                                    {plan.nome_plano}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {plan.max_vagas_padrao} vagas disponíveis
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
                                <span className="text-xs font-medium text-gray-500 uppercase">Cota</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 w-full">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-gray-500">R$</span>
                                <span className="text-2xl font-bold text-rose-500">
                                    {plan.valor_por_membro_divilo?.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="text-xs text-gray-500">/mês</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Valor sugerido por membro
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
