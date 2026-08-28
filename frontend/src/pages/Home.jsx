import {
  Activity,
  Map as MapIcon,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticlesBg from "particles-bg";
import EpiDataLogo from "../assets/EPI-DATA.png";

// Configurações de Particulas
// Para ativar a configParticulas, definir o "type" como "custom"
// Para desativar, definir o "type" como "square"
const configParticulas = {
  num: [5, 10], // Quantidade de partículas
  rps: 0.1,
  radius: [5, 40], // Tamanho
  life: [1.5, 3], // Tempo de vida na tela
  v: [2, 3], // Velocidade
  tha: [-40, 40], // Ângulo
  alpha: [0.6, 0], // Transparência
  scale: [0.1, 0.4], // Escala
  position: "all",
  color: ["#054060", "#e11d48", "#f59e0b", "#3b82f6"], // Coloque sua paleta de cores aqui!
  cross: "dead",
  random: 15,
};

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Particulas de fundo */}
      <ParticlesBg
        type="square"
        bg={true}
        className="z-10"
        config={configParticulas}
      />
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 text-center space-y-10 border border-white/50 relative z-10">
        <div className="flex justify-center">
          <img src={EpiDataLogo} alt="" className="w-75 -mt-25" />
        </div>

        <div className="space-y-5">
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed -mt-25">
            Sistema de Mapeamento Epidemiológico inteligente de Floriano, PI.
            Acompanhe as evoluções de casos, dados gerais, e zonas cubrindo a
            extensão territorial das UBSs.
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
            onClick={() => navigate("/dados-gerais")}
            className="group flex items-center gap-2 bg-[#054060] hover:bg-[#085883] text-white font-semibold text-lg py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-blue-600/30 active:scale-95"
          >
            Acessar Painel do Mapa
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            &copy; Secretaria de Saúde 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
