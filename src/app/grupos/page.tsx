"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import { GroupCard } from "@/components/ui/group-card";
import { useSearchParams } from "next/navigation";

type Grupo = {
    id: string;
    titulo: string;
    vagas_totais: number;
    vagas_ocupadas: number;
    valor_cota: number;
    servicos: {
        nome: string;
        categoria?: string;
    } | null;
};

function GroupsContent() {
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [filter, setFilter] = useState<string>("Todos");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    useEffect(() => {
        async function fetchGrupos() {
            setLoading(true);
            const { data } = await supabase
                .from("grupos")
                .select(`
                    *,
                    servicos (
                        nome,
                        categoria
                    )
                `)
                .order("created_at", { ascending: false });

            setGrupos(data || []);
            setLoading(false);
        }

        fetchGrupos();
    }, []);

    const filteredGrupos = grupos.filter((g) => {
        const matchesCategory = filter === "Todos" || g.servicos?.categoria === filter;
        const matchesSearch = searchQuery === "" ||
            g.titulo.toLowerCase().includes(searchQuery) ||
            g.servicos?.nome.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explorar Grupos</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Encontre o grupo perfeito para dividir sua assinatura.
                        {searchQuery && (
                            <span className="ml-2 text-rose-500 font-medium">
                                Resultados para "{searchQuery}"
                            </span>
                        )}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                    {["Todos", "Video", "Música", "Games"].map((categoria) => (
                        <button
                            key={categoria}
                            onClick={() => setFilter(categoria)}
                            className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${filter === categoria
                                ? "bg-rose-500 text-white shadow-rose-glow"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
                    </div>
                ) : filteredGrupos && filteredGrupos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGrupos.map((grupo) => (
                            <GroupCard
                                key={grupo.id}
                                id={grupo.id}
                                titulo={grupo.titulo}
                                servico={grupo.servicos?.nome || "Serviço"}
                                vagas_totais={grupo.vagas_totais}
                                vagas_ocupadas={grupo.vagas_ocupadas}
                                valor_cota={grupo.valor_cota}
                                isPublic={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🔍
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum grupo encontrado</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tente buscar por outro termo ou categoria.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function GroupsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center">Carregando...</div>}>
            <GroupsContent />
        </Suspense>
    );
}
