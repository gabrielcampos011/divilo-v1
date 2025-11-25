import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-rose-50 opacity-50 -skew-y-6 transform origin-top-left scale-110"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Economize em 3 passos simples
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            O Divilo conecta você a grupos de assinatura para que todos paguem menos.
                            Segurança, transparência e economia garantida.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rose-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-rose-600 font-bold">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Solicite Entrada</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Explore os grupos disponíveis e encontre a assinatura que você deseja.
                                    Solicite sua entrada e aguarde a aprovação do líder do grupo.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rose-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-rose-600 font-bold">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Faça o Pagamento</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Após aprovado, você verá a Chave Pix do grupo. Realize o pagamento
                                    da sua cota mensal diretamente para o líder.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rose-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-rose-600 font-bold">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Acesse o Serviço</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Pagamento confirmado? Pronto! O sistema libera automaticamente
                                    o Login e Senha do serviço para você aproveitar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Pronto para começar a economizar?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/grupos"
                            className="bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all transform hover:-translate-y-1"
                        >
                            Explorar Grupos
                        </Link>
                        <Link
                            href="/lider/novo"
                            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 text-lg font-bold py-4 px-10 rounded-full shadow-sm hover:shadow-md transition-all"
                        >
                            Criar meu Grupo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
