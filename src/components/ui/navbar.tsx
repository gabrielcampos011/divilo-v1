"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserNav } from "@/components/ui/user-nav";
import { NotificationBell } from "@/components/ui/notification-bell";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getUser();
    }, []);

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0 flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-rose-glow group-hover:scale-105 transition-transform">
                                    D
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Divilo</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

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
                                    Meus Grupos
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

                                <NotificationBell />
                                <UserNav user={user} />
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
