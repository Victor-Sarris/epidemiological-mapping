import React, { useState, useEffect } from "react";
import SidebarPrivate from "@/components/private/SidebarPrivate.jsx";
import {
  ShieldCheck,
  CheckCircle2,
  Activity,
  Baby,
  Syringe,
  Smile,
  User,
} from "lucide-react";

// Mapeamento idêntico ao do Ministério da Saúde
const FAIXAS_ETARIAS = {
  "Ao Nascer": ["BCG", "Hepatite B (<= 30 dias)"],
  "Menores de 1 ano de idade": [
    "Febre Amarela",
    "Poliomielite",
    "Pneumocócica Conjugada",
    "Meningocócica Conjugada",
    "Penta (DTP/HepB/Hib)",
    "Rotavírus",
  ],
  "1 ano de idade": [
    "Hepatite A Infantil",
    "DTP (1º Reforço)",
    "Tríplice Viral - 1º Dose",
    "Tríplice Viral - 2º Dose",
    "Pneumocócica Conjugada (1º Reforço)",
    "Poliomielite (1º Reforço)",
    "Varicela",
    "Meningocócica Conjugada (1º Reforço)",
  ],
  "4 anos de idade": [
    "DTP (2º Reforço)",
    "Varicela - 2º dose",
    "Febre Amarela (Reforço)",
  ],
};

// Ícones ilustrativos para o menu de atalhos no topo
const TABS_ICONS = {
  "Ao Nascer": Baby,
  "Menores de 1 ano de idade": Syringe,
  "1 ano de idade": Smile,
  "4 anos de idade": User,
};

// Lógica de cores baseada na legenda do DataSUS
function ProgressBarMS({ percentual, meta }) {
  const isMetaAtingida = percentual >= meta;

  let corBarra = "bg-[#1d4ed8]"; // Azul

  if (!isMetaAtingida) {
    if (percentual <= 20)
      corBarra = "bg-[#7f1d1d]"; // Vermelho Escuro
    else if (percentual <= 40)
      corBarra = "bg-[#e11d48]"; // Vermelho Claro
    else if (percentual <= 60)
      corBarra = "bg-[#f59e0b]"; // Laranja
    else if (percentual <= 80)
      corBarra = "bg-[#eab308]"; // Amarelo
    else corBarra = "bg-[#10b981]"; // Verde
  }

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
      <div
        className={`${corBarra} h-2.5 rounded-full transition-all duration-1000`}
        style={{ width: `${Math.min(percentual, 100)}%` }}
      ></div>
    </div>
  );
}

// O Card de cada Imunobiológico
function VacinaCard({ dados }) {
  const isMetaAtingida = dados.cobertura_percentual >= dados.meta_otima;

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#1e40af] p-5 flex flex-col justify-between h-44 relative hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="pr-14">
          <h3 className="font-bold text-slate-800 text-[15px] leading-tight">
            {dados.imunobiologico}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Meta ótima {dados.meta_otima}%
          </p>
        </div>

        {isMetaAtingida && (
          <div className="absolute top-4 right-4 flex flex-col items-center justify-center bg-[#1d4ed8] text-white rounded-full w-12 h-12 shadow-sm border-2 border-white">
            <span className="text-[6px] font-bold mt-0.5">META</span>
            <CheckCircle2 className="size-4" />
            <span className="text-[5px] font-bold mb-0.5">ATINGIDA</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end mt-auto">
        <h4 className="text-3xl font-bold text-slate-700 mb-1">
          {dados.cobertura_percentual.toFixed(2).replace(".", ",")}%
        </h4>
        <ProgressBarMS
          percentual={dados.cobertura_percentual}
          meta={dados.meta_otima}
        />
      </div>
    </div>
  );
}

export default function DashboardCoberturaVacinal({ isPrivateView = true }) {
  const [dadosVacinais, setDadosVacinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const anoVigente = 2026;

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/api/coberturavacinal/`);
        if (!response.ok) throw new Error("Erro ao buscar dados de vacinação");
        const data = await response.json();
        setDadosVacinais(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      <SidebarPrivate
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto overflow-x-hidden ml-0 md:ml-[var(--sidebar-width,16rem)] transition-all duration-300 relative">
        <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-200 bg-[#4180ab] text-white">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="size-5 md:size-6 text-[#1d4ed8]" />
            <h2 className="text-lg md:text-xl font-bold tracking-wide text-white">
              Cobertura Vacinal Infantil - {anoVigente}
            </h2>
          </div>
        </header>

        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Activity className="size-8 text-[#1d4ed8] animate-spin" />
            </div>
          ) : (
            <>
              {/* Menu de atalhos superiores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.keys(FAIXAS_ETARIAS).map((faixa) => {
                  const Icon = TABS_ICONS[faixa];
                  return (
                    <button
                      key={faixa}
                      onClick={() => {
                        document
                          .getElementById(faixa)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-white border border-slate-200 hover:border-[#1d4ed8] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-colors group shadow-sm cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Icon className="size-7 text-[#1d4ed8]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 text-center">
                        {faixa}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Seções por Faixa Etária */}
              {Object.entries(FAIXAS_ETARIAS).map(
                ([faixa, vacinasEsperadas]) => {
                  const vacinasEncontradas = dadosVacinais.filter(
                    (d) =>
                      d.ano === anoVigente &&
                      vacinasEsperadas.includes(d.imunobiologico),
                  );

                  return (
                    <section
                      key={faixa}
                      id={faixa}
                      className="pt-4 scroll-mt-24"
                    >
                      <h2 className="text-lg font-bold text-slate-800 text-center mb-6">
                        {faixa}
                      </h2>
                      {vacinasEncontradas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {vacinasEncontradas.map((vacina) => (
                            <VacinaCard key={vacina.id} dados={vacina} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed text-slate-400 text-sm font-medium">
                          Aguardando dados para esta faixa etária...
                        </div>
                      )}
                    </section>
                  );
                },
              )}
            </>
          )}
        </div>

        {/* Legenda flutuante idêntica ao DataSUS */}
        {!loading && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-4 sm:px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-wrap gap-4 sm:gap-6 items-center justify-center text-[10px] sm:text-xs font-semibold text-slate-600 z-40 w-[95%] md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#7f1d1d]"></span>{" "}
              0-20%
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#e11d48]"></span>{" "}
              21-40%
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#f59e0b]"></span>{" "}
              41-60%
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#eab308]"></span>{" "}
              61-80%
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#10b981]"></span>{" "}
              Avanço significativo ({">"}80%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-full bg-[#1d4ed8]"></span> Meta
              ótima
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
