import Link from "next/link";

type GroupCardProps = {
    id: string;
    titulo: string;
    servico: string;
    vagas_ocupadas: number;
    vagas_totais: number;
    valor_cota: number;
    isPublic?: boolean;
};

export function GroupCard({
    id,
    titulo,
    servico,
    vagas_ocupadas,
    vagas_totais,
    valor_cota,
    isPublic = false,
}: GroupCardProps) {
    const vagasDisponiveis = vagas_totais - vagas_ocupadas;
    const progressPercentage = (vagas_ocupadas / vagas_totais) * 100;

    return (
        <Link
            href={isPublic ? `/grupos/${id}` : `/lider/grupos/${id}`}
            className="block group"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="inline-block bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                            {servico}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors tracking-tight">
                            {titulo}
                        </h3>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1 tracking-wide">
                            Valor da Cota
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(valor_cota)}
                            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal">/mês</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1 tracking-wide">
                            Vagas
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                            {vagasDisponiveis}
                            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal">/{vagas_totais}</span>
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-rose-500 dark:bg-rose-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {vagasDisponiveis > 0 ? `${vagasDisponiveis} vaga${vagasDisponiveis > 1 ? 's' : ''} disponível${vagasDisponiveis > 1 ? 'eis' : ''}` : 'Grupo cheio'}
                    </span>
                    <span className="text-rose-500 dark:text-rose-400 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        {isPublic ? 'Ver detalhes' : 'Gerenciar'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
