"use client";

import { useState } from "react";
import { createConnectAccount } from "@/app/actions/stripe";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

export function StripeConnectButton({ isConnected }: { isConnected: boolean }) {
    const [loading, setLoading] = useState(false);

    async function handleConnect() {
        setLoading(true);
        try {
            const result = await createConnectAccount();
            if (result?.error) {
                toast.error(result.error);
            } else if (result?.url) {
                window.location.href = result.url;
            }
        } catch (e) {
            toast.error("Erro ao conectar com Stripe.");
        } finally {
            setLoading(false);
        }
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                <CreditCard className="w-5 h-5" />
                <span className="font-bold text-sm">Carteira Conectada</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={loading}
            className="flex items-center gap-2 bg-[#635BFF] hover:bg-[#5851E1] text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70"
        >
            <CreditCard className="w-5 h-5" />
            {loading ? "Conectando..." : "Receber Pagamentos (Stripe)"}
        </button>
    );
}
