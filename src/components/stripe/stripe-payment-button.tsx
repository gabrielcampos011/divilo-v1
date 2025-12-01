"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

interface StripePaymentButtonProps {
    groupId: string;
    priceId?: string; // Optional for now, can be used if we have multiple prices
}

export function StripePaymentButton({ groupId, priceId = "default" }: StripePaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handlePayment() {
        setLoading(true);
        try {
            const result = await createCheckoutSession(groupId, priceId);
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.url) {
                window.location.href = result.url;
            }
        } catch (e) {
            toast.error("Erro ao iniciar pagamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#635BFF] hover:bg-[#5851E1] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:-translate-y-1 flex items-center justify-center gap-2"
        >
            <CreditCard className="w-5 h-5" />
            {loading ? "Processando..." : "Pagar com Cartão"}
        </button>
    );
}
