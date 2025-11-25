import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { MembershipCard } from "@/components/ui/membership-card";
import { GroupCard } from "@/components/ui/group-card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch grupos que o usuário PARTICIPA (membros)
    const { data: memberships } = await supabase
        .from("membros")
        .select(`
      id,
      status,
      grupo_id,
      grupos (
        id,
        titulo,
        valor_cota,
        servicos (
          nome
        )
      )
    `)
        .eq("user_id", user.id)
        .order("data_solicitacao", { ascending: false });

    // Fetch grupos que o usuário LIDERA
    const { data: gruposLiderados } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (
        nome
      )
    `)
        .eq("lider_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Dashboard</h1>
                    <p className="text-gray-500 text-lg">Gerencie suas assinaturas e grupos</p>
                </div>

                {/* Seção A - Minhas Assinaturas (PRIORIDADE) */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Minhas Assinaturas</h2>
                            <p className="text-gray-500 mt-1">Grupos dos quais você participa</p>
                        </div>
                    </div>

                    {memberships && memberships.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {memberships.map((membership: any) => (
                                <MembershipCard
                                    key={membership.id}
                                    grupoId={membership.grupos.id}
                                    titulo={membership.grupos.titulo}
                                    servico={membership.grupos.servicos?.nome || "Serviço"}
                                    status={membership.status}
                                    valorCota={membership.grupos.valor_cota}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-premium-sm p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                                Você ainda não participa de nenhum grupo
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
                                Explore os grupos disponíveis e comece a economizar em suas assinaturas favoritas.
                            </p>
                            <Link
                                href="/grupos"
                                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5 inline-block"
                            >
                                Explorar Grupos
                            </Link>
                        </div>
                    )}
                </section>

                {/* Seção B - Meus Grupos (Líder) */}
                {gruposLiderados && gruposLiderados.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Grupos que Lidero</h2>
                                <p className="text-gray-500 mt-1">Gerencie seus grupos e aprovações</p>
                            </div>
                            <Link
                                href="/lider/novo"
                                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <span className="text-xl">+</span> Criar Novo Grupo
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gruposLiderados.map((grupo: any) => (
                                <GroupCard
                                    key={grupo.id}
                                    id={grupo.id}
                                    titulo={grupo.titulo}
                                    servico={grupo.servicos?.nome || "Serviço"}
                                    vagas_totais={grupo.vagas_totais}
                                    vagas_ocupadas={grupo.vagas_ocupadas}
                                    valor_cota={grupo.valor_cota}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA para criar grupo (se não for líder ainda) */}
                {(!gruposLiderados || gruposLiderados.length === 0) && (
                    <section className="mt-16">
                        <div className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-12 shadow-premium-sm text-center">
                            <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
                                👑
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                                Quer economizar ainda mais?
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                                Crie seu próprio grupo e divida os custos da sua assinatura com outras pessoas.
                            </p>
                            <Link
                                href="/lider/novo"
                                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5 inline-block"
                            >
                                Criar Meu Primeiro Grupo
                            </Link>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
