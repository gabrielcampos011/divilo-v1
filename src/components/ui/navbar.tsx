import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-rose-glow group-hover:scale-105 transition-transform">
                                D
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Divilo</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/grupos"
                                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                            >
                                Explorar
                            </Link>
                            {user && (
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <Link
                                href="/como-funciona"
                                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                            >
                                Como Funciona
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/lider/novo"
                                    className="hidden md:flex items-center gap-2 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-semibold text-sm border border-rose-200 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-700 px-4 py-2 rounded-full transition-all"
                                >
                                    <span className="text-lg">+</span> Criar Grupo
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 focus:outline-none">
                                        <div className="w-9 h-9 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-800 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-300 font-bold text-sm border-2 border-white dark:border-gray-800 shadow-premium-sm hover-lift">
                                            {user.email?.substring(0, 2).toUpperCase()}
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-premium-lg border border-gray-100 dark:border-gray-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Logado como</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{user.email}</p>
                                        </div>
                                        <Link href="/perfil" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                            Meu Perfil
                                        </Link>
                                        <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                            Dashboard
                                        </Link>
                                        <div className="border-t border-gray-50 dark:border-gray-800 mt-1 pt-1">
                                            <form action={logout}>
                                                <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 font-medium transition-colors">
                                                    Sair
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 font-medium text-sm px-4 py-2 transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
