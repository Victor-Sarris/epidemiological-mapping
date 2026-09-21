import {
  Map as MapIcon,
  ShieldAlert,
  ArrowRight,
  UserCircle2,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EpiDataLogo from "../assets/EPI-DATA.png";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useState } from "react";
import ParticlesBg from "particles-bg";
import PrivacyPolicyModal from "@/components/Modal/PrivacyPolicy";
import TermsModal from "@/components/Modal/TermsModal";

function Home() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin("");

    const success = await login(username, password);
    if (success) {
      navigate("/profissional/dashboard");
    } else {
      setErroLogin("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-transparent">
      <ParticlesBg type="cobweb" color="#054060" num={60} bg={true} />

      {/* Lado Esquerdo - Importante manter o 'relative z-10' */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 md:p-12 lg:p-16 relative z-10 -mt-14">
        <div className="max-w-xl mx-auto w-full">
          <img
            src={EpiDataLogo}
            alt="EPI-DATA"
            className="w-40 sm:w-48 lg:w-56 mb-8 sm:mb-10 mx-auto lg:mx-0"
          />

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 text-center lg:text-left drop-shadow-sm">
            Mapeamento Epidemiológico
            <span className="block text-[#054060] mt-1">Floriano, PI</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-10 lg:mb-12 text-center lg:text-left">
            Acompanhe a evolução de casos, dados gerais e as zonas de
            abrangência das UBSs em tempo real para tomada rápida de decisões.
          </p>

          <div className="space-y-3 sm:space-y-4">
            {/* Item 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/60 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#054060]/10 flex items-center justify-center shrink-0">
                <MapIcon
                  className="size-5 sm:size-6 text-[#054060]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Mapa de Calor
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  Densidade de casos segmentada pelas áreas de quadrantes.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-white/60 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <ShieldAlert
                  className="size-5 sm:size-6 text-amber-600"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Controle de Surtos
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  Mapeamento de risco e suporte à decisão em tempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-120 bg-white/80 backdrop-blur-lg flex flex-col justify-center p-6 sm:p-10 md:p-12 lg:px-16 lg:py-16 border-t lg:border-t-0 lg:border-l border-slate-200/50 relative z-10 shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] -mt-14">
        <div className="max-w-md mx-auto w-full space-y-10 lg:space-y-12">
          {/* Acesso Público */}
          <div>
            <h2 className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 sm:mb-4 text-center lg:text-left">
              Acesso Público
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="group w-full flex items-center justify-between bg-[#054060] hover:bg-[#085883] focus:ring-4 focus:ring-[#054060]/20 text-white font-semibold text-sm sm:text-base py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl transition-colors hover:cursor-pointer shadow-md"
            >
              <span>Acessar Painel do Mapa</span>
              <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                <ArrowRight className="size-4 sm:size-5" aria-hidden="true" />
              </div>
            </button>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4 text-center lg:text-left">
              Visão geral dos dados epidemiológicos da cidade.
            </p>
          </div>

          {/* Área do Profissional */}
          <div className="bg-white/95 p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-[#054060] rounded-l-2xl"></div>

            <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 mb-2">
              <UserCircle2 className="size-5 text-[#054060]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Área do Profissional
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 text-center lg:text-left">
              Acesso restrito para agentes e gestores de saúde da UBS
              previamente cadastrados.
            </p>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  placeholder="Login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 text-[#054060] border border-slate-200 hover:border-slate-300 font-semibold text-sm py-2.5 sm:py-3 rounded-lg transition-colors mt-1 sm:mt-2 hover:cursor-pointer outline-none focus:ring-2 focus:ring-[#054060]/20"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 text-[#054060] border border-slate-200 hover:border-slate-300 font-semibold text-sm py-2.5 sm:py-3 rounded-lg transition-colors mt-1 sm:mt-2 hover:cursor-pointer outline-none focus:ring-2 focus:ring-[#054060]/20"
                />
              </div>

              {erroLogin && (
                <p className="text-rose-600 text-sm font-medium bg-rose-50 p-2 rounded-md border border-rose-100">
                  {erroLogin}
                </p>
              )}

              <button
                type="submit"
                className="flex gap-3 justify-center items-center p-2 border-transparent bg-[#054060] border rounded-lg hover:bg-[#085883] focus:ring-4 focus:ring-[#054060]/20 text-white font-semibold text-sm sm:text-base py-3.5 sm:py-4 px-5 sm:px-6 transition-colors hover:cursor-pointer shadow-md w-full"
              >
                <LockKeyhole className="size-4" />
                <span>Fazer Login</span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center lg:text-left pt-6 sm:pt-8 mt-4 border-t border-slate-200/60">
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">
              Secretaria de Saúde
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-slate-400">
              Floriano, PI &copy; {new Date().getFullYear()}
            </p>

            <div className="flex flex-row flex-wrap justify-center lg:justify-start items-center mt-5 gap-3">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-[10px] sm:text-xs font-medium text-slate-400 hover:text-[#054060] hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-[#054060]/30 rounded-sm hover:cursor-pointer"
              >
                Política de Privacidade
              </button>

              <span className="text-slate-300 text-[10px]">•</span>

              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-[10px] sm:text-xs font-medium text-slate-400 hover:text-[#054060] hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-[#054060]/30 rounded-sm hover:cursor-pointer"
              >
                Termos de Uso
              </button>
            </div>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}

export default Home;
