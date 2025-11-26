"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GroupTabsProps {
    regras?: string;
    faq?: any[]; // JSONB from Supabase
}

export function GroupTabs({ regras, faq }: GroupTabsProps) {
    const [activeTab, setActiveTab] = useState<"sobre" | "regras" | "duvidas">("sobre");

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[400px]">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab("sobre")}
                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 ${activeTab === "sobre"
                            ? "border-rose-500 text-rose-500"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                >
                    Sobre
                </button>
                <button
                    onClick={() => setActiveTab("regras")}
                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 ${activeTab === "regras"
                            ? "border-rose-500 text-rose-500"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                >
                    Regras
                </button>
                <button
                    onClick={() => setActiveTab("duvidas")}
                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 ${activeTab === "duvidas"
                            ? "border-rose-500 text-rose-500"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                >
                    Dúvidas
                </button>
            </div>

            {/* Tabs Content */}
            <div className="p-8">
                {activeTab === "sobre" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Como funciona?</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Este grupo permite dividir os custos de uma assinatura premium.
                                O líder do grupo gerencia o pagamento e compartilha o acesso com os membros.
                                Você paga apenas sua cota mensal e economiza até 70% em comparação com a assinatura individual.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Economia Garantida</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pague muito menos pelo mesmo serviço.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Sem Fidelidade</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Saia quando quiser (com aviso prévio).</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "regras" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Regras do Grupo</h3>
                        {regras ? (
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {regras}
                            </div>
                        ) : (
                            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-3">
                                    <span className="text-rose-500 font-bold">•</span>
                                    Realizar o pagamento da cota até a data de vencimento.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-rose-500 font-bold">•</span>
                                    Não alterar a senha ou configurações da conta compartilhada.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-rose-500 font-bold">•</span>
                                    Respeitar o limite de telas/dispositivos acordado.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-rose-500 font-bold">•</span>
                                    Avisar com 30 dias de antecedência antes de sair do grupo.
                                </li>
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === "duvidas" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Perguntas Frequentes</h3>
                        {faq && faq.length > 0 ? (
                            faq.map((item: any, index: number) => (
                                <FAQItem key={index} question={item.question} answer={item.answer} />
                            ))
                        ) : (
                            <>
                                <FAQItem
                                    question="Como recebo o acesso?"
                                    answer="Após a confirmação do seu pagamento, o login e senha serão liberados automaticamente aqui na plataforma."
                                />
                                <FAQItem
                                    question="É seguro?"
                                    answer="Sim! O Divilo intermedeia a organização, e o líder só recebe sua cota se mantiver o serviço ativo."
                                />
                                <FAQItem
                                    question="Posso cancelar quando quiser?"
                                    answer="Sim, basta solicitar a saída com 30 dias de antecedência para não prejudicar o grupo."
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span className="font-medium text-gray-900 dark:text-white">{question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800">
                    {answer}
                </div>
            )}
        </div>
    );
}
