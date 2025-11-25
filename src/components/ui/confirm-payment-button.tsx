"use client";

import confetti from "canvas-confetti";
import { toast } from "sonner";
import { confirmPayment } from "@/app/actions/manage-payment";
import { useState } from "react";

interface ConfirmPaymentButtonProps {
    memberId: string;
    groupId: string;
}

export function ConfirmPaymentButton({ memberId, groupId }: ConfirmPaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await confirmPayment(memberId, groupId);

            // Fire confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10B981', '#34D399', '#6EE7B7'] // Green shades
            });

            toast.success("Pagamento confirmado!", {
                description: "O membro agora tem acesso às credenciais.",
            });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao confirmar pagamento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
        >
            {loading ? "Confirmando..." : "Confirmar Pagamento"}
        </button>
    );
}
