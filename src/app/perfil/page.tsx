import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AchievementsSection } from "@/components/ui/achievements-section";
import { ChangePasswordForm } from "@/components/forms/change-password-form";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch groups led by user
    const { data: gruposLiderados } = await supabase
        .from("grupos")
        .select("*, servicos(nome)")
        .eq("lider_id", user.id);

    // Fetch groups user is a member of
    const { data: participacoes } = await supabase
        .from("membros")
        .select("*, grupos(*, servicos(nome))")
        .eq("user_id", user.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / User Info */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-3xl mx-auto mb-4">
                                {user.email?.substring(0, 2).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Usuário</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                            <div className="border-t border-gray-100 pt-6 text-left">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-3">Estatísticas</p>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Grupos que lidero</span>
                                    <span className="font-bold text-gray-900">{gruposLiderados?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Participações</span>
                                    <span className="font-bold text-gray-900">{participacoes?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-2 space-y-8">

                        {/* Conquistas */}
                        <AchievementsSection user={user} createdGroupsCount={gruposLiderados?.length || 0} />

                        {/* Alterar Senha */}
                        <ChangePasswordForm />

                        {/* Grupos que Participo */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 p-1 rounded-lg text-sm">👥</span>
                                Grupos que participo
                            </h3>

                            {participacoes && participacoes.length > 0 ? (
                                <div className="grid gap-4">
                                    {participacoes.map((p: any) => (
                                        <Link
                                            key={p.id}
                                            href={`/grupos/${p.grupo_id}`}
                                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">
                                                    {p.grupos?.servicos?.nome?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">
                                                        {p.grupos?.titulo}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Status: <span className={`font-medium ${p.status === 'pago' ? 'text-green-600' :
                                                            p.status === 'aprovado' ? 'text-yellow-600' : 'text-gray-500'
                                                            }`}>{p.status}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 group-hover:translate-x-1 transition-transform">
                                                &rarr;
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
                                    Você ainda não participa de nenhum grupo.
                                    <Link href="/grupos" className="text-rose-500 font-bold hover:underline ml-1">
                                        Explorar agora
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Grupos que Lidero */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-rose-100 text-rose-600 p-1 rounded-lg text-sm">👑</span>
                                Grupos que lidero
                            </h3>

                            {gruposLiderados && gruposLiderados.length > 0 ? (
                                <div className="grid gap-4">
                                    {gruposLiderados.map((g: any) => (
                                        <Link
                                            key={g.id}
                                            href={`/lider/grupos/${g.id}`}
                                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center font-bold text-rose-500">
                                                    {g.servicos?.nome?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">
                                                        {g.titulo}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {g.vagas_ocupadas}/{g.vagas_totais} vagas ocupadas
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 group-hover:translate-x-1 transition-transform">
                                                &rarr;
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
                                    Você não lidera nenhum grupo.
                                    <Link href="/lider/novo" className="text-rose-500 font-bold hover:underline ml-1">
                                        Criar grupo
                                    </Link>
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
