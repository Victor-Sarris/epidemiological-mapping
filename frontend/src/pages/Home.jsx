import { Activity, Map as MapIcon, ShieldAlert } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-8 border border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="bg-rose-100 p-4 rounded-full shadow-inner">
            <Activity className="size-12 text-rose-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Sistema de Mapeamento Epidemiológico
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Plataforma de inteligência em saúde pública para Floriano, PI.
            Acompanhe a evolução de casos, identifique zonas de calor e gerencie
            a cobertura territorial das UBSs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 border rounded-xl bg-slate-50 flex flex-col items-center gap-3 transition-colors hover:bg-slate-100">
            <MapIcon className="size-8 text-blue-500" />
            <h3 className="font-semibold text-slate-800">
              Mapa de Calor (Quadrantes)
            </h3>
            <p className="text-sm text-slate-500 text-center">
              Visualização da densidade de casos segmentados pelas áreas de
              abrangência.
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-slate-50 flex flex-col items-center gap-3 transition-colors hover:bg-slate-100">
            <ShieldAlert className="size-8 text-amber-500" />
            <h3 className="font-semibold text-slate-800">Controle de Surtos</h3>
            <p className="text-sm text-slate-500 text-center">
              Mapeamento de riscos e suporte à tomada de decisão para contenção
              de vetores.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md">
            Acessar Painel do Mapa
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
