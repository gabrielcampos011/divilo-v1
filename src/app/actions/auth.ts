'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Credenciais inválidas. Verifique seu email e senha." };
    }

    revalidatePath("/", "layout");
    redirect("/grupos");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: "Erro ao criar conta. Tente novamente." };
    }

    revalidatePath("/", "layout");
    redirect("/grupos");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." };
    }

    if (password.length < 6) {
        return { error: "A senha deve ter pelo menos 6 caracteres." };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: "Erro ao atualizar senha. Tente novamente." };
    }

    return { success: "Senha atualizada com sucesso!" };
}
