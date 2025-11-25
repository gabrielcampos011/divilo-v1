import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { approveMember } from "@/app/actions/approve-member";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfirmPaymentButton } from "@/components/ui/confirm-payment-button";

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

    // Fetch Members
    const { data: membros } = await supabase
        .from("membros")
        .select(`
      id,
      status,
      data_solicitacao,
      user_id
    `)
        .eq("grupo_id", id)
        .order("data_solicitacao", { ascending: false });

    const pendentes = membros?.filter((m) => m.status === "pendente") || [];
    const aprovados = membros?.filter((m) => ["aprovado", "pago"].includes(m.status)) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/lider"
                        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
                    >
                        &larr; Voltar para Meus Grupos
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{grupo.titulo}</h1>
                            <p className="text-gray-600 mt-1">
                                {grupo.servicos?.nome} • {grupo.vagas_ocupadas}/{grupo.vagas_totais} Vagas
                            </p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
                            <p className="text-xs text-gray-500 uppercase font-bold">Cota</p>
                            <p className="text-xl font-bold text-rose-500">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(grupo.valor_cota)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Solicitações Pendentes */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Solicitações Pendentes
                            {pendentes.length > 0 && (
                                <span className="bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full">
                                    {pendentes.length}
                                </span>
                            )}
                        </h2>
                    </div>

                    {pendentes.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {pendentes.map((membro) => (
                                <div key={membro.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Usuário #{membro.user_id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">
                                            Solicitado em {new Date(membro.data_solicitacao).toLocaleDateString()}
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
                                            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
                                        >
                                            Aprovar Entrada
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            Nenhuma solicitação pendente no momento.
                        </div>
                    )}
                </div>

                {/* Membros Ativos */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Membros do Grupo</h2>
                    </div>

                    {aprovados.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {aprovados.map((membro) => (
                                <div key={membro.id} className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                            U
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Usuário #{membro.user_id.slice(0, 8)}</p>
                                            <p className="text-sm text-gray-500">
                                                {membro.status === 'pago' ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {membro.status === 'pago' ? (
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                                Pago
                                            </span>
                                        ) : (
                                            <ConfirmPaymentButton memberId={membro.id} groupId={id} />
                                        )}

                                        <form
                                            action={async () => {
                                                "use server";
                                                const { removeMember } = await import("@/app/actions/manage-payment");
                                                await removeMember(membro.id, id);
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                title="Remover Membro"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            Ainda não há membros aprovados neste grupo.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
