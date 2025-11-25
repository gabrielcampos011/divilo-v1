import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100/50 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-rose-500 mb-4 block tracking-tight">
                            Divilo
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A maneira mais inteligente de dividir suas assinaturas digitais.
                            Economize dinheiro e gerencie seus grupos com facilidade.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-tight">Plataforma</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/grupos" className="hover:text-rose-500 transition-colors">
                                    Explorar Grupos
                                </Link>
                            </li>
                            <li>
                                <Link href="/como-funciona" className="hover:text-rose-500 transition-colors">
                                    Como Funciona
                                </Link>
                            </li>
                            <li>
                                <Link href="/lider" className="hover:text-rose-500 transition-colors">
                                    Para Líderes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-tight">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-rose-500 transition-colors">
                                    Termos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-rose-500 transition-colors">
                                    Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-rose-500 transition-colors">
                                    Regras da Comunidade
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm tracking-tight">Contato</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <a href="mailto:suporte@divilo.com.br" className="hover:text-rose-500 transition-colors">
                                    suporte@divilo.com.br
                                </a>
                            </li>
                            <li className="flex gap-3 mt-4">
                                <div className="w-9 h-9 bg-gray-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer flex items-center justify-center text-lg">
                                    📷
                                </div>
                                <div className="w-9 h-9 bg-gray-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer flex items-center justify-center text-lg">
                                    🐦
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © 2025 Divilo. Todos os direitos reservados.
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        Feito com <span className="text-rose-500">♥</span> para economizar.
                    </p>
                </div>
            </div>
        </footer>
    );
}
