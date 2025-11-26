"use client";

import { Navbar } from "@/components/ui/navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl mb-6">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Como podemos ajudar?
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Encontre respostas para as dúvidas mais comuns ou entre em contato com nosso suporte.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chat Online</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            Fale com nossa equipe em tempo real. Disponível de Seg a Sex, 9h às 18h.
                        </p>
                        <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
                            Iniciar Chat &rarr;
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            Envie sua dúvida e responderemos em até 24 horas.
                        </p>
                        <a href="mailto:suporte@divilo.com.br" className="text-green-600 dark:text-green-400 font-semibold text-sm hover:underline">
                            suporte@divilo.com.br &rarr;
                        </a>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Perguntas Frequentes</h2>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Como funciona o pagamento?</AccordionTrigger>
                            <AccordionContent>
                                O pagamento é feito diretamente ao líder do grupo via PIX. A plataforma Divilo apenas facilita a organização e o controle dos pagamentos, mas não processa transações financeiras diretamente.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>É seguro entrar em um grupo?</AccordionTrigger>
                            <AccordionContent>
                                Sim! Recomendamos que você verifique a reputação do líder e utilize os canais de contato fornecidos no grupo. O Divilo oferece ferramentas para reportar problemas caso algo não saia como esperado.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Posso sair de um grupo a qualquer momento?</AccordionTrigger>
                            <AccordionContent>
                                Sim, você pode solicitar a saída de um grupo a qualquer momento. Recomendamos avisar o líder com antecedência para que ele possa encontrar outro membro para sua vaga.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Como crio meu próprio grupo?</AccordionTrigger>
                            <AccordionContent>
                                Para criar um grupo, basta clicar em "Criar Grupo" na página inicial ou no seu painel. Você precisará definir o serviço, valor da cota e regras do grupo.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
        </div>
    );
}
