"use client";

import { useState } from "react";
import { createGroup } from "@/app/actions/create-group";

type Servico = {
    id: string;
    nome: string;
    categoria: string;
};

export function CreateGroupWizard({ servicos }: { servicos: Servico[] }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        servico_id: "",
        titulo: "",
        vagas_totais: "5",
        valor_cota: "",
        pix_key: "",
        login_acesso: "",
        senha_acesso: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Create FormData object to match Server Action signature
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            await createGroup(data);
        } catch (error) {
            console.error(error);
            alert("Erro ao criar grupo. Tente novamente.");
            setLoading(false);
        }
    };

    const selectedService = servicos.find(s => s.id === formData.servico_id);

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
                    <span className="text-sm font-medium hidden sm:block">Serviço</span>
                </div>
                <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                    <span className="text-sm font-medium hidden sm:block">Detalhes</span>
                </div>
                <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
                    <span className="text-sm font-medium hidden sm:block">Acesso</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {/* Step 1: Service Selection */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-gray-900">Qual serviço você vai compartilhar?</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {servicos.map((servico) => (
                                <label
                                    key={servico.id}
                                    className={`relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${formData.servico_id === servico.id
                                        ? 'border-rose-500 bg-rose-50'
                                        : 'border-gray-100 hover:border-rose-200'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="servico_id"
                                        value={servico.id}
                                        checked={formData.servico_id === servico.id}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className="flex-1 font-medium text-gray-900">{servico.nome}</span>
                                    {formData.servico_id === servico.id && (
                                        <span className="text-rose-500">✓</span>
                                    )}
                                </label>
                            ))}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!formData.servico_id}
                                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-full transition-all shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Public Details */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-gray-900">Detalhes do Grupo</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título do Grupo</label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                placeholder={`Ex: ${selectedService?.nome} da Família`}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vagas Totais</label>
                                <select
                                    name="vagas_totais"
                                    value={formData.vagas_totais}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                >
                                    {[2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Vagas</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Cota (Mensal)</label>
                                <input
                                    type="text"
                                    name="valor_cota"
                                    value={formData.valor_cota}
                                    onChange={handleChange}
                                    placeholder="R$ 0,00"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Use vírgula para centavos (ex: 15,90)</p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-gray-500 hover:text-gray-900 font-medium px-4"
                            >
                                Voltar
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!formData.titulo || !formData.valor_cota}
                                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Sensitive Data */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-bold text-yellow-800">Dados Protegidos</h3>
                                <p className="text-sm text-yellow-700">
                                    Estas informações só serão reveladas para membros que tiverem o pagamento confirmado por você.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chave Pix (para receber)</label>
                            <input
                                type="text"
                                name="pix_key"
                                value={formData.pix_key}
                                onChange={handleChange}
                                placeholder="CPF, Email ou Aleatória"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Login do Serviço</label>
                                <input
                                    type="text"
                                    name="login_acesso"
                                    value={formData.login_acesso}
                                    onChange={handleChange}
                                    placeholder="email@exemplo.com"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha do Serviço</label>
                                <input
                                    type="text"
                                    name="senha_acesso"
                                    value={formData.senha_acesso}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-gray-500 hover:text-gray-900 font-medium px-4"
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.pix_key || !formData.login_acesso || !formData.senha_acesso}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                            >
                                {loading ? "Criando..." : "Finalizar e Criar Grupo"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
