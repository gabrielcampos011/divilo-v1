"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function DebugTheme() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleManual = () => {
        const html = document.documentElement
        if (html.classList.contains('dark')) {
            html.classList.remove('dark')
        } else {
            html.classList.add('dark')
        }
    }

    return (
        <div className="p-10 space-y-4 min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <h1 className="text-2xl font-bold">Debug Tema (Tailwind v4)</h1>
            <p>Tema Selecionado: {theme}</p>
            <p>Tema Resolvido (Sistema): {resolvedTheme}</p>
            <p>HTML Class: {document.documentElement.className}</p>

            <div className="flex gap-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Toggle via next-themes
                </button>
                <button
                    onClick={toggleManual}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Toggle Manual (DOM)
                </button>
            </div>

            <div className="w-32 h-32 bg-gray-200 dark:bg-[#050505] border-4 border-red-500 flex items-center justify-center text-red-500 dark:text-white font-bold rounded-lg">
                {resolvedTheme === 'dark' ? 'DARK' : 'LIGHT'}
            </div>

            <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900">
                <p>Se este container ficar escuro, o dark mode está funcionando.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Body BG: {window.getComputedStyle(document.body).backgroundColor}</p>
            </div>
        </div>
    )
}
