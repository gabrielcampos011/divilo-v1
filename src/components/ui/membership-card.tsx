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
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            icon: "⏳",
            action: null,
        },
        aprovado: {
            label: "Pagamento Pendente",
            color: "bg-green-100 text-green-700 border-green-200",
            icon: "💳",
            action: { label: "Ver Dados de Pagamento", href: `/grupos/${grupoId}` },
        },
        pago: {
            label: "Acesso Liberado",
            color: "bg-blue-100 text-blue-700 border-blue-200",
            icon: "✓",
            action: { label: "Ver Credenciais", href: `/grupos/${grupoId}` },
        },
    };

    const config = statusConfig[status];

    return (
        <Link href={`/grupos/${grupoId}`} className="block group">
            <div className="bg-white rounded-2xl p-6 shadow-premium-sm hover:shadow-premium-md hover:-translate-y-1 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="inline-block bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                            {servico}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors tracking-tight">
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
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Valor da Cota</p>
                        <p className="text-xl font-bold text-gray-900">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(valorCota)}
                            <span className="text-sm text-gray-400 font-normal">/mês</span>
                        </p>
                    </div>

                    {config.action && (
                        <span className="text-rose-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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
