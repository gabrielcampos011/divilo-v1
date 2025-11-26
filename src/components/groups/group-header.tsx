import { BadgeCheck, ShieldCheck, Users } from "lucide-react";

interface GroupHeaderProps {
    titulo: string;
    servico: string;
    vagasOcupadas: number;
    vagasTotais: number;
    descricao?: string;
    liderNome?: string;
}

export function GroupHeader({ titulo, servico, vagasOcupadas, vagasTotais, descricao, liderNome }: GroupHeaderProps) {
    const progress = (vagasOcupadas / vagasTotais) * 100;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Icon Box */}
                <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-rose-200 dark:shadow-rose-900/20 shrink-0">
                    {servico?.charAt(0)}
                </div>

                <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {servico}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Grupo Verificado
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {titulo}
                    </h1>

                    {descricao && (
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-2xl">
                            {descricao}
                        </p>
                    )}

                    {liderNome && (
                        <div className="flex items-center gap-2 mb-4">
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Líder: <span className="font-bold text-gray-900 dark:text-white">{liderNome}</span>
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{vagasOcupadas}/{vagasTotais}</p>
                                <p className="text-xs">Vagas ocupadas</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
