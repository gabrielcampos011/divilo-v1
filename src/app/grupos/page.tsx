import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { GroupCard } from "@/components/ui/group-card";
import Link from "next/link";

export default async function GroupsPage() {
    const supabase = await createClient();

    // Fetch all groups
    const { data: grupos } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (
        nome
      )
    `)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Explorar Grupos</h1>
                    <p className="text-gray-600 mt-1">
                        Encontre o grupo perfeito para dividir sua assinatura.
                    </p>
                </div>

                {/* Filters (Static for MVP) */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                    <button className="bg-rose-500 text-white px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap">
                        Todos
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full font-medium text-sm hover:border-gray-300 whitespace-nowrap">
                        Streaming
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full font-medium text-sm hover:border-gray-300 whitespace-nowrap">
                        Música
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full font-medium text-sm hover:border-gray-300 whitespace-nowrap">
                        Games
                    </button>
                </div>

                {grupos && grupos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grupos.map((grupo: any) => (
                            <GroupCard
                                key={grupo.id}
                                id={grupo.id}
                                titulo={grupo.titulo}
                                servico={grupo.servicos?.nome || "Serviço"}
                                vagas_totais={grupo.vagas_totais}
                                vagas_ocupadas={grupo.vagas_ocupadas}
                                valor_cota={grupo.valor_cota}
                                // We need to adjust GroupCard to accept a custom link or handle the logic
                                // Currently GroupCard links to `/lider/grupos/[id]` which is wrong for public view.
                                // I will update GroupCard to accept a `href` prop or create a PublicGroupCard.
                                // For now, I'll update GroupCard in the next step to be flexible.
                                isPublic={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🔍
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Nenhum grupo encontrado
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Não encontramos grupos com os filtros selecionados. Tente novamente mais tarde.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
