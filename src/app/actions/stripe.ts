'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover', // Use latest or compatible version
});

export async function createConnectAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Usuário não autenticado." };
    }

    // Check if user already has an account
    const { data: existingAccount } = await supabase
        .from("stripe_accounts")
        .select("stripe_account_id, charges_enabled")
        .eq("user_id", user.id)
        .single();

    if (existingAccount?.charges_enabled) {
        return { error: "Você já possui uma conta conectada." };
    }

    let accountId = existingAccount?.stripe_account_id;

    if (!accountId) {
        try {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'BR', // Assuming Brazil based on context
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
            accountId = account.id;

            // Save to DB
            await supabase.from("stripe_accounts").insert({
                user_id: user.id,
                stripe_account_id: accountId,
            });
        } catch (error) {
            console.error("Stripe Create Account Error:", error);
            return { error: "Erro ao criar conta Stripe." };
        }
    }

    // Create Account Link
    try {
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lider`, // Redirect back on failure/refresh
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/lider?stripe_connected=true`, // Redirect back on success
            type: 'account_onboarding',
        });

        return { url: accountLink.url };
    } catch (error) {
        console.error("Stripe Account Link Error:", error);
        return { error: "Erro ao gerar link de conexão." };
    }
}

export async function getStripeAccountStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("stripe_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return data;
}

export async function createCheckoutSession(groupId: string, priceId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Usuário não autenticado." };

    // 1. Fetch Group and Leader Details
    const { data: grupo } = await supabase
        .from("grupos")
        .select(`
            *,
            lider:lider_id (id)
        `)
        .eq("id", groupId)
        .single();

    if (!grupo) return { error: "Grupo não encontrado." };

    // 2. Fetch Leader's Stripe Account
    const { data: leaderStripe } = await supabase
        .from("stripe_accounts")
        .select("stripe_account_id, charges_enabled")
        .eq("user_id", grupo.lider_id)
        .single();

    if (!leaderStripe?.charges_enabled) {
        return { error: "O líder do grupo ainda não configurou os pagamentos." };
    }

    // 3. Calculate Amounts
    const amount = Math.round(grupo.valor_cota * 100); // Convert to cents
    const appFee = Math.round(amount * 0.10); // 10% Platform Fee (Example)

    try {
        // 4. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment', // or 'subscription' if recurring
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Assinatura: ${grupo.titulo}`,
                            description: `Mensalidade do grupo ${grupo.titulo}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                application_fee_amount: appFee,
                transfer_data: {
                    destination: leaderStripe.stripe_account_id,
                },
                metadata: {
                    groupId: groupId,
                    userId: user.id,
                },
            },
            metadata: {
                groupId: groupId,
                userId: user.id,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/grupos/${groupId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/grupos/${groupId}?canceled=true`,
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return { error: "Erro ao criar sessão de pagamento." };
    }
}
