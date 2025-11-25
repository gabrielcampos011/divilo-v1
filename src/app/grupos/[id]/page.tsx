import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { requestEntry } from "@/app/actions/join-group";
import Link from "next/link";

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

    // Fetch Group Details
    const { data: grupo } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (nome)
    `)
        .eq("id", id)
        .single();

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/grupos"
                    className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block font-medium"
                >
                    &larr; Voltar para Grupos
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-rose-600 font-bold text-4xl shadow-lg">
                                {grupo.servicos?.nome?.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                                    {grupo.servicos?.nome}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{grupo.titulo}</h1>
                                <p className="text-rose-100 text-lg">
                                    Economize compartilhando esta assinatura premium.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <p className="text-gray-500 text-sm font-medium mb-1">Valor da Cota</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-4xl font-bold text-gray-900">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(grupo.valor_cota)}
                                    </p>
                                    <span className="text-gray-400 font-medium">/mês</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-gray-500 text-sm font-medium">Ocupação</p>
                                    <p className="text-gray-900 font-bold">
                                        {grupo.vagas_ocupadas} <span className="text-gray-400 font-normal">de {grupo.vagas_totais} vagas</span>
                                    </p>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-rose-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="border-t border-gray-100 pt-10">
                            {!user ? (
                                <div className="text-center max-w-md mx-auto">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interessado neste grupo?</h3>
                                    <p className="text-gray-600 mb-6">
                                        Faça login ou crie sua conta para solicitar entrada e começar a economizar.
                                    </p>
                                    <Link
                                        href={`/login?next=/grupos/${id}`}
                                        className="inline-block w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-1"
                                    >
                                        Entrar para Solicitar
                                    </Link>
                                </div>
                            ) : isLeader ? (
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center">
                                    <p className="text-rose-800 font-bold text-lg mb-2">
                                        👑 Você é o líder deste grupo
                                    </p>
                                    <p className="text-rose-600 mb-6">
                                        Gerencie membros, pagamentos e acessos no seu painel.
                                    </p>
                                    <Link
                                        href={`/lider/grupos/${id}`}
                                        className="inline-block bg-white text-rose-600 border-2 border-rose-100 hover:border-rose-200 font-bold py-3 px-8 rounded-xl transition-colors"
                                    >
                                        Ir para Painel do Líder
                                    </Link>
                                </div>
                            ) : memberStatus === "aprovado" || memberStatus === "pago" ? (
                                <div className="space-y-6">
                                    {/* Pix Section - Visible for Approved & Paid */}
                                    <div className="bg-white border-2 border-green-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                            PASSO 1: PAGAMENTO
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">💸</span>
                                            Dados para Pagamento
                                        </h3>

                                        {/* Fetch Pix Data */}
                                        {await (async () => {
                                            const { data: pixData } = await supabase
                                                .from("grupos_pix")
                                                .select("pix_key")
                                                .eq("grupo_id", id)
                                                .single();

                                            return pixData ? (
                                                <div className="bg-gray-50 p-5 rounded-xl break-all border border-gray-200">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Chave Pix</p>
                                                    <p className="font-mono text-lg text-gray-900 font-medium select-all">{pixData.pix_key}</p>
                                                </div>
                                            ) : <p className="text-red-500">Erro ao carregar Pix.</p>;
                                        })()}

                                        {memberStatus !== "pago" && (
                                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100">
                                                <span className="text-2xl">⚠️</span>
                                                <p className="text-sm flex-1">
                                                    Após realizar o pagamento no app do seu banco, avise o líder para liberar seu acesso.
                                                </p>
                                                <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap">
                                                    Já paguei
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Credentials Section - Visible ONLY for Paid */}
                                    {memberStatus === "pago" ? (
                                        <div className="bg-white border-2 border-rose-100 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="absolute top-0 right-0 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                                PASSO 2: ACESSO
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <span className="bg-rose-100 text-rose-600 p-2 rounded-lg text-xl">🔑</span>
                                                Credenciais de Acesso
                                            </h3>

                                            {/* Fetch Credentials Data */}
                                            {await (async () => {
                                                const { data: accessData } = await supabase
                                                    .from("grupos_acesso")
                                                    .select("login_acesso, senha_acesso")
                                                    .eq("grupo_id", id)
                                                    .single();

                                                return accessData ? (
                                                    <div className="grid gap-4">
                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Login</p>
                                                            <p className="font-mono text-lg text-gray-900 font-medium select-all">{accessData.login_acesso}</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Senha</p>
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-mono text-lg text-gray-900 font-medium select-all">{accessData.senha_acesso}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : <p className="text-red-500">Erro ao carregar credenciais.</p>;
                                            })()}

                                            <div className="mt-6 text-center">
                                                <p className="text-green-600 font-bold flex items-center justify-center gap-2">
                                                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                                                    Acesso Liberado! Aproveite.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center opacity-75">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xl mx-auto mb-4">
                                                🔒
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-500 mb-2">Credenciais de Acesso</h3>
                                            <p className="text-gray-400 text-sm">
                                                As credenciais serão liberadas automaticamente após a confirmação do pagamento.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : memberStatus === "pendente" ? (
                                <div className="text-center bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-2xl mx-auto mb-4 animate-pulse">
                                        ⏳
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-800 mb-2">
                                        Solicitação Enviada
                                    </h3>
                                    <p className="text-yellow-700 max-w-md mx-auto">
                                        Sua solicitação está com o líder do grupo. Assim que for aprovada, você receberá os dados para pagamento.
                                    </p>
                                </div>
                            ) : isFull ? (
                                <div className="text-center bg-gray-50 rounded-2xl p-8">
                                    <p className="text-gray-500 font-bold text-xl mb-2">
                                        🚫 Grupo Cheio
                                    </p>
                                    <p className="text-gray-400">
                                        Não há mais vagas disponíveis neste grupo.
                                    </p>
                                </div>
                            ) : (
                                <form
                                    action={async () => {
                                        "use server";
                                        await requestEntry(id);
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
                                    >
                                        Solicitar Entrada no Grupo
                                        <span className="text-rose-200">→</span>
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Sem compromisso. Você só paga após ser aprovado.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
