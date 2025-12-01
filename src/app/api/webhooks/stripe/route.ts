export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Usamos uma chave de fallback em tempo de build para evitar erro caso STRIPE_SECRET_KEY
// ainda não esteja carregada no ambiente (por exemplo, em builds locais ou CI).
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_build_mock", {
    apiVersion: '2025-11-17.clover',
    typescript: true,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const groupId = session.metadata?.groupId;
            const userId = session.metadata?.userId;

            if (groupId && userId) {
                // Update member status to 'pago'
                const { error } = await supabase
                    .from("membros")
                    .update({ status: "pago" })
                    .eq("grupo_id", groupId)
                    .eq("user_id", userId);

                if (error) {
                    console.error("Error updating member status:", error);
                    return NextResponse.json({ error: "Error updating member status" }, { status: 500 });
                }
                console.log(`Member ${userId} marked as paid for group ${groupId}`);
            }
            break;

        case "account.updated":
            const account = event.data.object as Stripe.Account;
            if (account.charges_enabled) {
                // Update local stripe_accounts table
                // We need to find the user associated with this stripe_account_id
                const { error } = await supabase
                    .from("stripe_accounts")
                    .update({ charges_enabled: true })
                    .eq("stripe_account_id", account.id);

                if (error) {
                    console.error("Error updating stripe account status:", error);
                }
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
