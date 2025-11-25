import Link from "next/link";

type MembershipCardProps = {
    grupoId: string;
    titulo: string;
    servico: string;
    status: "pendente" | "aprovado" | "pago";
    valorCota: number;
};

export function MembershipCard({
    grupoId,
    titulo,
    servico,
    status,
    valorCota,
}: MembershipCardProps) {
    const statusConfig = {
        pendente: {
            label: "Aguardando Aprovação",
            color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
            icon: "⏳",
            action: null,
        },
        aprovado: {
            label: "Pagamento Pendente",
            color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
            icon: "💳",
            action: { label: "Ver Dados de Pagamento", href: `/grupos/${grupoId}` },
        },
        pago: {
            label: "Acesso Liberado",
            color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
            icon: "✓",
            action: { label: "Ver Credenciais", href: `/grupos/${grupoId}` },
        },
    };

    const config = statusConfig[status];

    return (
        <Link href={`/grupos/${grupoId}`} className="block group">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-premium-md hover:-translate-y-1 transition-all duration-300 border-none">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="inline-block bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                            {servico}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors tracking-tight">
                            {titulo}
                        </h3>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold mb-4 ${config.color}`}>
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1">Valor da Cota</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-50">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(valorCota)}
                            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal">/mês</span>
                        </p>
                    </div>

                    {config.action && (
                        <span className="text-rose-500 dark:text-rose-400 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            {config.action.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
