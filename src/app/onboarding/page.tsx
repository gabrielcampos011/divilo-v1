import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { Search, PlusCircle } from "lucide-react";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6 tracking-tight">
                        Bem-vindo ao Divilo!
                    </h1>
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        Como você quer economizar?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Card A - Entrar em um grupo */}
                    <Link
                        href="/grupos"
                        className="group block"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4 tracking-tight">
                                Quero entrar em um grupo
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                Encontre vagas em Spotify, Netflix e mais. Compartilhe custos e economize até 75%.
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-rose-500 dark:text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">
                                Explorar grupos
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Card B - Criar um grupo */}
                    <Link
                        href="/lider/novo"
                        className="group block"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PlusCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4 tracking-tight">
                                Tenho uma assinatura
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                Crie um grupo e divida os custos da sua conta. Você lidera e economiza junto com outros.
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-rose-500 dark:text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">
                                Criar grupo
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}

