"use client";

import { Service } from "./service-brand-selector";

interface PlanSelectorProps {
    services: Service[];
    selectedBrand: string;
    onSelectPlan: (service: Service) => void;
    onBack: () => void;
}

export function PlanSelector({ services, selectedBrand, onSelectPlan, onBack }: PlanSelectorProps) {
    // Filter plans for the selected brand
    const plans = services.filter(s => s.grupo_servico === selectedBrand);

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
