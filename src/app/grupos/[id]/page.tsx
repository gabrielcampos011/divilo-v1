import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { GroupHeader } from "@/components/groups/group-header";
import { GroupTabs } from "@/components/groups/group-tabs";
import { GroupSidebar } from "@/components/groups/group-sidebar";
import { ServiceAccessCard } from "@/components/groups/service-access-card";
import { ReportGroupButton } from "@/components/groups/report-group-button";
import { LeaveGroupButton } from "@/components/groups/leave-group-button";

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
    const { data: grupo, error: grupoError } = await supabase
        .from("grupos")
        .select(`
      *,
      servicos (nome)
    `)
        .eq("id", id)
        .single();

    // Log error for debugging
    if (grupoError) {
        console.error("Error fetching group:", grupoError);
        console.error("Error details:", JSON.stringify(grupoError, null, 2));
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

    // Fetch leader profile separately
    let leaderName: string | undefined;
    if (grupo.lider_id) {
        const { data: leaderProfile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", grupo.lider_id)
            .single();
        leaderName = leaderProfile?.full_name;
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

    // Fetch Members (only if user is a member)
    let membersList: any[] = [];
    if (memberStatus === "aprovado" || memberStatus === "pago") {
        const { data: members } = await supabase
            .from("membros")
            .select(`
                id,
                status,
                user_id,
                profiles!user_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq("grupo_id", id)
            .in("status", ["aprovado", "pago"]);

        membersList = members?.map(m => ({
            ...m,
            profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
        })) || [];
    }

    // Fetch PIX Key (for approved and paid members)
    let pixKey = undefined;
    if (memberStatus === "aprovado" || memberStatus === "pago") {
        const { data: pixData } = await supabase
            .from("grupos_pix")
            .select("pix_key")
            .eq("grupo_id", id)
            .single();
        pixKey = pixData?.pix_key;
    }

    // Fetch Service Access (for paid members)
    let serviceAccess = null;
    if (memberStatus === "pago") {
        const { data: accessData } = await supabase
            .from("grupos_acesso")
            .select("login_acesso, senha_acesso")
            .eq("grupo_id", id)
            .single();
        serviceAccess = accessData;
    }

    const isLeader = user?.id === grupo.lider_id;
    const isFull = grupo.vagas_ocupadas >= grupo.vagas_totais;

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
                    <div className="lg:col-span-2 space-y-8">
                        <GroupHeader
                            titulo={grupo.titulo}
                            servico={grupo.servico_personalizado_nome || grupo.servicos?.nome || "Serviço"}
                            vagasOcupadas={grupo.vagas_ocupadas}
                            vagasTotais={grupo.vagas_totais}
                            descricao={grupo.descricao}
                            liderNome={leaderName}
                        />

                        <GroupTabs
                            regras={grupo.regras}
                            faq={grupo.faq}
                        />

                        {/* Members List (Visible only to members) */}
                        {(memberStatus === "aprovado" || memberStatus === "pago") && membersList.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    Membros do Grupo
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                                        {membersList.length}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {membersList.map((member: any) => (
                                        <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold">
                                                {member.profiles?.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {member.profiles?.full_name || `Usuário #${member.user_id.slice(0, 8)}`}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {member.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Service Access (Visible only to paid members) */}
                        {memberStatus === "pago" && serviceAccess && (
                            <ServiceAccessCard
                                loginAccess={serviceAccess.login_acesso}
                                senhaAccess={serviceAccess.senha_acesso}
                                contatoLider={grupo.contato_lider}
                            />
                        )}
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
                                pixKey={pixKey}
                            />
                            <ReportGroupButton groupId={id} groupTitle={grupo.titulo} />
                            {(memberStatus === "aprovado" || memberStatus === "pago") && !isLeader && (
                                <LeaveGroupButton
                                    groupId={id}
                                    groupTitle={grupo.titulo}
                                    hasCaucao={grupo.tem_caucao}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
