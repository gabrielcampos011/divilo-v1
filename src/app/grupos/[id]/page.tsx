import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { GroupHeader } from "@/components/groups/group-header";
import { GroupTabs } from "@/components/groups/group-tabs";
import { GroupSidebar } from "@/components/groups/group-sidebar";

export default async function PublicGroupDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();
    const { id } = await params;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch Group Details with leader name
    const { data: grupo, error: grupoError } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (nome),
      profiles:lider_id (
        full_name
      )
    `)
        .eq("id", id)
        .single();

    // Log error for debugging
    if (grupoError) {
        console.error("Error fetching group:", grupoError);
    }

    if (!grupo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Grupo não encontrado</h1>
                    <Link href="/grupos" className="text-rose-500 hover:underline mt-4 block">
                        Voltar para Grupos
                    </Link>
                </div>
            </div>
        );
    }

    // Check Member Status
    let memberStatus = null;
    if (user) {
        const { data: member } = await supabase
            .from("membros")
            .select("status")
            .eq("grupo_id", id)
            .eq("user_id", user.id)
            .single();
        memberStatus = member?.status;
    }

    const isLeader = user?.id === grupo.lider_id;
    const isFull = grupo.vagas_ocupadas >= grupo.vagas_totais;
    const progressPercentage = (grupo.vagas_ocupadas / grupo.vagas_totais) * 100;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Link
                    href="/grupos"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 inline-flex items-center gap-2 font-medium transition-colors"
                >
                    &larr; Voltar para Grupos
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <GroupHeader
                            titulo={grupo.titulo}
                            servico={grupo.servico_personalizado_nome || grupo.servicos?.nome || "Serviço"}
                            vagasOcupadas={grupo.vagas_ocupadas}
                            vagasTotais={grupo.vagas_totais}
                            descricao={grupo.descricao}
                            liderNome={grupo.profiles?.full_name}
                        />

                        <GroupTabs
                            regras={grupo.regras}
                            faq={grupo.faq}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <GroupSidebar
                                groupId={id}
                                valorCota={grupo.valor_cota}
                                temCaucao={grupo.tem_caucao || false}
                                valorCaucao={grupo.valor_caucao || 0}
                                fidelidadeMeses={grupo.fidelidade_meses || 0}
                                isLeader={isLeader}
                                memberStatus={memberStatus}
                                isFull={isFull}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
