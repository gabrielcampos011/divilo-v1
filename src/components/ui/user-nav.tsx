"use client";

import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { User } from "@supabase/supabase-js";

interface UserNavProps {
    user: User;
}

export function UserNav({ user }: UserNavProps) {
    return (
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
    );
}
