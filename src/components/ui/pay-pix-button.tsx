"use client";

import confetti from "canvas-confetti";
import { toast } from "sonner";

export function PayPixButton() {
    const handlePayment = () => {
        // Fire confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Show toast
        toast.success("Pagamento informado!", {
            description: "O líder foi notificado e irá liberar seu acesso em breve.",
            duration: 5000,
        });
    };

    return (
        <button
            onClick={handlePayment}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
            Já paguei
        </button>
    );
}
