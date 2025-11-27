"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, HelpCircle } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Início", icon: Home },
        { href: "/lider", label: "Líder", icon: Users },
        { href: "/ajuda", label: "Ajuda", icon: HelpCircle },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 md:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive
                                ? "text-rose-500 dark:text-rose-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
