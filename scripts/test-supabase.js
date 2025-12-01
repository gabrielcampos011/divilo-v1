const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

function loadEnvFile(filename) {
    const envPath = path.resolve(process.cwd(), filename)
    if (!fs.existsSync(envPath)) {
        throw new Error(`${filename} não encontrado. Crie o arquivo antes de testar.`)
    }

    const content = fs.readFileSync(envPath, "utf-8")
    content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .forEach((line) => {
            const eqIndex = line.indexOf("=")
            if (eqIndex === -1) return

            const key = line.slice(0, eqIndex).trim()
            let value = line.slice(eqIndex + 1).trim()

            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1)
            }

            if (!process.env[key]) {
                process.env[key] = value
            }
        })
}

async function main() {
    loadEnvFile(".env.local")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes.")
    }

    const client = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await client.from("servicos").select("id").limit(3)

    if (error) {
        console.error("Erro ao consultar Supabase:", error)
        process.exit(1)
    }

    console.log("Servicos sample:", data)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})

