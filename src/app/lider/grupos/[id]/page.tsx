import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { approveMember } from "@/app/actions/approve-member";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberListItem } from "@/components/groups/member-list-item";

export default async function GroupDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();
    const { id } = await params;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Group Details
    const { data: grupo } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (nome)
    `)
        .eq("id", id)
        .single();

    // Security check: Only leader can view
    if (!grupo || grupo.lider_id !== user.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Acesso Negado</h1>
                    <p className="text-gray-600">Você não é o líder deste grupo.</p>
                    <Link href="/lider" className="text-rose-500 hover:underline mt-4 block">
                        Voltar para Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch Members with profile names
    const { data: membros } = await supabase
        .from("membros")
        .select(`
      id,
      status,
      data_solicitacao,
      user_id,
      profiles:user_id (
        full_name
      )
    `)
        .eq("grupo_id", id)
        .order("data_solicitacao", { ascending: false });

    const pendentes = membros?.filter((m) => m.status === "pendente") || [];
    const aprovados = membros?.filter((m) => ["aprovado", "pago"].includes(m.status)) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/lider"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 inline-block transition-colors"
                    >
                        &larr; Voltar para Meus Grupos
                    </Link>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{grupo.titulo}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                                    {grupo.servicos?.nome}
                                </span>
                                <span>•</span>
                                <span>{grupo.vagas_ocupadas}/{grupo.vagas_totais} Vagas ocupadas</span>
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center min-w-[150px]">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Valor da Cota</p>
                            <p className="text-2xl font-bold text-rose-500">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(grupo.valor_cota)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Solicitações Pendentes */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Solicitações Pendentes
                            {pendentes.length > 0 && (
                                <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    {pendentes.length}
                                </span>
                            )}
                        </h2>
                    </div>

                    {pendentes.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {pendentes.map((membro) => (
                                <div key={membro.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Usuário #{membro.user_id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Solicitou entrada em {new Date(membro.data_solicitacao).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <form
                                        action={async () => {
                                            "use server";
                                            await approveMember(membro.id, id);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 hover:-translate-y-0.5 text-sm"
                                        >
                                            Aprovar Entrada
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <span className="text-2xl">📭</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma solicitação pendente</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Novos interessados aparecerão aqui.</p>
                        </div>
                    )}
                </div>

                {/* Membros Ativos */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Membros do Grupo
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                {aprovados.length}
                            </span>
                        </h2>
                    </div>

                    {aprovados.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {aprovados.map((membro) => (
                                <MemberListItem
                                    key={membro.id}
                                    member={membro}
                                    groupId={id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <span className="text-2xl">👥</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Ainda não há membros no grupo</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Compartilhe o link do grupo para atrair interessados.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
