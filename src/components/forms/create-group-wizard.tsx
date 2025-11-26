"use client";

import { useState } from "react";
import { Service, ServiceBrandSelector } from "./service-brand-selector";
import { PlanSelector } from "./plan-selector";
import { GroupConfigForm } from "./group-config-form";

export function CreateGroupWizard({ servicos }: { servicos: Service[] }) {
    const [step, setStep] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Service | null>(null);

    const handleSelectBrand = (brand: string) => {
        setSelectedBrand(brand);
        setStep(2);
    };

    const handleSelectPlan = (plan: Service) => {
        setSelectedPlan(plan);
        setStep(3);
    };

    const handleBackToBrand = () => {
        setStep(1);
        setSelectedBrand(null);
    };

    const handleBackToPlan = () => {
        setStep(2);
        setSelectedPlan(null);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden max-w-5xl w-full">
            {/* Progress Bar */}
            <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                    <span className="text-sm font-medium hidden sm:block text-gray-900 dark:text-gray-100">Serviço</span>
                </div>
                <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                    <span className="text-sm font-medium hidden sm:block text-gray-900 dark:text-gray-100">Plano</span>
                </div>
                <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
                    <span className="text-sm font-medium hidden sm:block text-gray-900 dark:text-gray-100">Configuração</span>
                </div>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <ServiceBrandSelector
                        services={servicos}
                        onSelectBrand={handleSelectBrand}
                    />
                )}

                {step === 2 && selectedBrand && (
                    <PlanSelector
                        services={servicos}
                        selectedBrand={selectedBrand}
                        onSelectPlan={handleSelectPlan}
                        onBack={handleBackToBrand}
                    />
                )}

                {step === 3 && selectedPlan && (
                    <GroupConfigForm
                        selectedPlan={selectedPlan}
                        onBack={handleBackToPlan}
                    />
                )}
            </div>
        </div>
    );
}
