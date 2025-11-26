"use client";

import { useState, useMemo } from "react";

export type Service = {
    id: string;
    nome: string; // Legacy name, might be null in old records but we fixed it
    grupo_servico: string | null;
    nome_plano: string | null;
    nome_completo: string | null;
    categoria: string | null;
    valor_por_membro_divilo: number | null;
    max_vagas_padrao: number | null;
};

interface ServiceBrandSelectorProps {
    services: Service[];
    onSelectBrand: (brand: string) => void;
}

export function ServiceBrandSelector({ services, onSelectBrand }: ServiceBrandSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    // Extract unique brands and their categories
    const brands = useMemo(() => {
        const uniqueBrands = new Map<string, string>();

        services.forEach(service => {
            if (service.grupo_servico) {
                // If brand already exists, prefer keeping it (or handle multiple categories if needed)
                if (!uniqueBrands.has(service.grupo_servico)) {
                    uniqueBrands.set(service.grupo_servico, service.categoria || "Outros");
                }
            }
        });

        return Array.from(uniqueBrands.entries()).map(([name, category]) => ({
            name,
            category
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [services]);

    // Extract unique categories for filter
    const categories = useMemo(() => {
        const cats = new Set<string>(["Todos"]);
        brands.forEach(b => cats.add(b.category));
        return Array.from(cats).sort();
    }, [brands]);

    const filteredBrands = brands.filter(brand =>
        selectedCategory === "Todos" || brand.category === selectedCategory
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    Qual serviço você vai compartilhar?
                </h2>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                ? "bg-rose-500 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBrands.map((brand) => (
                    <button
                        key={brand.name}
                        onClick={() => onSelectBrand(brand.name)}
                        className="group relative flex flex-col items-center justify-center p-6 h-32 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-rose-500 dark:hover:border-rose-500 hover:shadow-lg transition-all text-center"
                    >
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-rose-500 transition-colors">
                            {brand.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {brand.category}
                        </span>
                    </button>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Nenhum serviço encontrado nesta categoria.
                </div>
            )}
        </div>
    );
}
