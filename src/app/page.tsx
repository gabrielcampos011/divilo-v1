import { Navbar } from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";
import { GroupCard } from "@/components/ui/group-card";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // Fetch public groups (limit 6 for home)
  const { data: grupos } = await supabase
    .from("grupos")
    .select(`
      *,
      servicos (
        nome
      )
    `)
    .limit(6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-500 to-rose-600 text-white py-24 px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-rose-glow-lg mb-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span>✨</span>
              <span>Novidade: Economia Compartilhada</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Economize até 75% em assinaturas premium
            </h1>
            <p className="text-xl text-rose-100 mb-10 max-w-lg leading-relaxed">
              Compartilhe custos com grupos confiáveis e aproveite seus serviços favoritos gastando menos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/grupos"
                className="bg-white text-rose-600 font-semibold py-4 px-10 rounded-full hover:bg-rose-50 transition-all shadow-premium-lg hover:shadow-premium-md hover:-translate-y-0.5"
              >
                Começar Agora
              </Link>
              <Link
                href="/como-funciona"
                className="glass text-white font-semibold py-4 px-10 rounded-full hover:bg-white/20 transition-all"
              >
                Ver Como Funciona
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-12 text-sm font-medium text-rose-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl">
                  📉
                </div>
                <div>
                  <p className="text-white font-bold text-2xl">75%</p>
                  <p className="text-rose-100">Economia média</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <div>
                  <p className="text-white font-bold text-2xl">100%</p>
                  <p className="text-rose-100">Seguro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="hidden md:block relative">
            <div className="w-96 h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl absolute -top-20 -right-20"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 mb-24">
        <div className="bg-white rounded-3xl shadow-premium-lg p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-rose-500 font-bold text-3xl mb-2 tracking-tight">R$ 2.400+</p>
            <p className="text-gray-400 text-sm font-medium">Economizados</p>
          </div>
          <div>
            <p className="text-rose-500 font-bold text-3xl mb-2 tracking-tight">15K+</p>
            <p className="text-gray-400 text-sm font-medium">Usuários Ativos</p>
          </div>
          <div>
            <p className="text-rose-500 font-bold text-3xl mb-2 tracking-tight">98%</p>
            <p className="text-gray-400 text-sm font-medium">Satisfação</p>
          </div>
          <div>
            <p className="text-rose-500 font-bold text-3xl mb-2 tracking-tight">66</p>
            <p className="text-gray-400 text-sm font-medium">Plataformas</p>
          </div>
        </div>
      </section>

      {/* Grupos Disponíveis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Grupos Disponíveis</h2>
          <Link href="/grupos" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors flex items-center gap-1">
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Filters (Static for MVP) */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <button className="bg-rose-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap shadow-rose-glow transition-all hover:shadow-rose-glow-lg">
            Todas
          </button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-50 whitespace-nowrap shadow-premium-sm transition-all">
            Streaming
          </button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-50 whitespace-nowrap shadow-premium-sm transition-all">
            Música
          </button>
          <button className="bg-white text-gray-600 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-50 whitespace-nowrap shadow-premium-sm transition-all">
            Games
          </button>
        </div>

        {grupos && grupos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grupos.map((grupo: any) => (
              <GroupCard
                key={grupo.id}
                id={grupo.id}
                titulo={grupo.titulo}
                servico={grupo.servicos?.nome || "Serviço"}
                vagas_totais={grupo.vagas_totais}
                vagas_ocupadas={grupo.vagas_ocupadas}
                valor_cota={grupo.valor_cota}
                isPublic={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-400">Nenhum grupo disponível no momento.</p>
          </div>
        )}
      </section>

      {/* Referral Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-premium-sm">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6 text-rose-600 font-semibold">
              <span className="text-2xl">🎁</span>
              <span>Todo mundo ganha</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Indique amigos e ganhe créditos
            </h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed">
              Indique amigos e ganhe créditos para usar na plataforma. Quanto mais você indicar, mais você ganha!
            </p>
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-rose-glow hover:shadow-rose-glow-lg hover:-translate-y-0.5">
              Começar Agora
            </button>
          </div>
          <div className="text-9xl opacity-10 rotate-12 select-none">
            🎁
          </div>
        </div>
      </section>
    </div>
  );
}
