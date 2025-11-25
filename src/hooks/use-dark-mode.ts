"use client"
import { useEffect, useState } from "react"

export function useDarkMode() {
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem("theme")
        if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setTheme("dark")
            document.documentElement.classList.add("dark")
        } else {
            setTheme("light")
            document.documentElement.classList.remove("dark")
        }
    }, [])

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light")
            localStorage.setItem("theme", "light")
            document.documentElement.classList.remove("dark")
        } else {
            setTheme("dark")
            localStorage.setItem("theme", "dark")
            document.documentElement.classList.add("dark")
        }
    }

    return { theme, toggleTheme, mounted }
}
