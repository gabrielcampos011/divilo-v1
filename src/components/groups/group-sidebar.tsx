"use client";

import { requestEntry } from "@/app/actions/join-group";
import Link from "next/link";
import { Shield, Lock, CreditCard } from "lucide-react";

interface GroupSidebarProps {
    groupId: string;
    valorCota: number;
    temCaucao: boolean;
    valorCaucao: number;
    fidelidadeMeses: number;
    isLeader: boolean;
    memberStatus: string | null;
    isFull: boolean;
    user: any;
}

export function GroupSidebar({ groupId, valorCota, temCaucao, valorCaucao, fidelidadeMeses, isLeader, memberStatus, isFull, user }: GroupSidebarProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valor da cota mensal</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(valorCota)}
                        </span>
                        <span className="text-gray-400">/mês</span>
                    </div>

                    {/* Deposit Info */}
                    {temCaucao && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">+ Caução (1º mês)</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(valorCaucao)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">Total 1º Mês</span>
                                <span className="text-lg font-bold text-rose-500">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(valorCota + valorCaucao)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                A caução é devolvida ao sair do grupo.
                            </p>
                        </div>
                    )}

                    {/* Loyalty Badge */}
                    {fidelidadeMeses > 0 && (
                        <div className="mt-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-xs font-bold">
                            <Lock className="w-3 h-3" />
                            Fidelidade: {fidelidadeMeses} Meses
                        </div>
                    )}
                </div>

                {!user ? (
                    <div className="space-y-3">
                        <Link
                            href={`/login?next=/grupos/${groupId}`}
                            className="w-full block bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20"
                        >
                            Entrar para Solicitar
                        </Link>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            Crie sua conta grátis em segundos
                        </p>
                    </div>
                ) : isLeader ? (
                    <div className="space-y-3">
                        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 p-4 rounded-xl text-center text-sm font-medium">
                            Você é o líder deste grupo
                        </div>
                        <Link
                            href={`/lider/grupos/${groupId}`}
                            className="w-full block bg-white dark:bg-gray-800 border-2 border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold py-3 px-6 rounded-xl text-center hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                        >
                            Gerenciar Grupo
                        </Link>
                    </div>
                ) : memberStatus === "aprovado" || memberStatus === "pago" ? (
                    <div className="space-y-3">
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Você é membro
                        </div>
                        {memberStatus === "pago" && (
                            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                                Próximo pagamento: 05/12
                            </div>
                        )}
                    </div>
                ) : memberStatus === "pendente" ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-4 rounded-xl text-center text-sm font-medium">
                        Solicitação Enviada
                    </div>
                ) : isFull ? (
                    <button disabled className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed">
                        Grupo Cheio
                    </button>
                ) : (
                    <form
                        action={async () => {
                            await requestEntry(groupId);
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/20 hover:-translate-y-1"
                        >
                            Solicitar Entrada
                        </button>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                            Sem compromisso. Pague só se aprovado.
                        </p>
                    </form>
                )}
            </div>

            {/* Security Badges */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Compra Segura</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Seu pagamento fica retido até você confirmar o acesso.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Dados Protegidos</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Criptografia de ponta a ponta em todas as transações.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Sem Taxas Extras</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">O valor que você vê é o valor final que você paga.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
