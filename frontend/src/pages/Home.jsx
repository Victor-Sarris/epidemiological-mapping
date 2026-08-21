import {
  Activity,
  Map as MapIcon,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo Suave */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />

      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 text-center space-y-10 border border-white/50 relative z-10">
        <div className="flex justify-center">
          <div className="bg-linear-to-br from-rose-100 to-rose-50 p-5 rounded-2xl shadow-inner border border-rose-100">
            <Activity className="size-14 text-rose-600" />
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
            Sistema de Mapeamento Epidemiológico
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Plataforma de inteligência em saúde pública para Floriano, PI.
            Acompanhe a evolução de casos, identifique zonas de calor e gerencie
            a cobertura territorial das UBSs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <MapIcon className="size-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Mapa de Calor Georreferenciado
            </h3>
            <p className="text-sm text-slate-500 text-center leading-relaxed">
              Visualização da densidade de casos segmentados pelas áreas de
              abrangência dos quadrantes.
            </p>
          </div>

          <div className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
              <ShieldAlert className="size-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              Controle de Surtos e Vetores
            </h3>
            <p className="text-sm text-slate-500 text-center leading-relaxed">
              Mapeamento de riscos e suporte analítico à tomada de decisão para
              contenção em tempo real.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <button
            onClick={() => navigate("/mapa-epidemiologico")}
            className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-lg py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-rose-600/30 active:scale-95"
          >
            Acessar Painel do Mapa
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Apoio Institucional: Prefeitura Municipal de São Francisco do Piauí
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
