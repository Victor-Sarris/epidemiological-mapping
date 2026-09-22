import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SidebarPrivate from "@/components/private/SidebarPrivate.jsx";
import {
  Users,
  Activity,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Menu,
  Bell,
  UserCircle,
  CalendarDays,
} from "lucide-react";
import PatientModal from "../components/Modal/PatientModal.jsx";
import {
  CurvaEpidemica,
  StatusDonut,
  PerfilDemografico,
} from "../components/Modal/DashboardCharts.jsx";
import KpisGrid from "../components/KpisGrid.jsx";
import DistribuicaoQuadrante from "../components/DistribuicaoQuadrante.jsx";
import CasosRecentes from "../components/CasosRecentes.jsx";
import DashboardSifilis from "./DashboardSifilis.jsx";
import DashboardTuberculose from "./DashBoardTuberculose.jsx";
import DashboardChagas from "./DashBoardChagas.jsx";
import DashboardHanseniase from "./DashBoardHans.jsx";
import DashboardHepatite from "./DashBoardHepa.jsx";
import DashboardViolencia from "./private/DashBoardViolencia.jsx";
import EndemiaSelector from "../components/EndemiasSelector.jsx";
import DashboardAcidentes from "./DashboardAcidentes.jsx";
import DashboardIntoxicacao from "./DashboardIntoxicacao.jsx";

const ENDEMIAS = [
  { id: "dengue", nome: "Dengue", endpoint: "/api/dengue/" },
  { id: "sifilis", nome: "Sífilis", endpoint: "/api/sifilis/" },
  { id: "tuberculose", nome: "Tuberculose", endpoint: "/api/tuberculose/" },
  { id: "chagas", nome: "Chagas", endpoint: "/api/chagas/" },
  { id: "hanseniase", nome: "Hanseníase", endpoint: "/api/hans/" },
  { id: "hepatite", nome: "Hepatite", endpoint: "/api/hepatite/" },
  {
    id: "animaispec",
    nome: "Animais Peçonhentos",
    endpoint: "/api/animaispec/",
  },
  {
    id: "intoxicacao",
    nome: "Casos de Intoxicação",
    endpoint: "/api/animaispec/",
  },
  {
    id: "violencia",
    nome: "Violência Domestica",
    endpoint: "/api/intoxicacao/",
  },
];

const BAIRRO_PARA_UBS = {
  CENTRO: "UBS Floriano (Centro)",
  SAMBAIBA: "UBS Dirceu Arcoverde",
  "SAMBAIBA VELHA": "UBS Dirceu Arcoverde",
  MANGUINHA: "UBS José Paraguassú",
  "ALTO DA CRUZ": "UBS Theodoro F. Sobral",
  "CAMPO VELHO": "UBS Pedro Simplício",
  "REDE NOVA": "UBS Alfredo de Carvalho",
  TABOCA: "UBS Luiz Tavares",
  "IRAPUA I": "UBS Camilo Filho",
  "IRAPUA II": "UBS Camilo Filho",
  "NOSSA SENHORA DA GUIA": "UBS N. Sra. da Guia",
  TIBERAO: "UBS Raimundo Filho",
  "BOM LUGAR": "UBS Paulo Kalume",
  "BOSQUE SANTA TEREZINHA": "UBS João Elias Oka",
  "CAIXA D AGUA": "UBS Theodoro F. Sobral",
  CAJUEIRO: "UBS João Elias Oka",
  "ALTO DA GUIA": "UBS N. Sra. da Guia",
  CURADOR: "UBS Theodoro F. Sobral",
  IBIAPABA: "UBS Viana de Carvalho",
  "PAU FERRADO": "UBS Paulo Martins",
  "SAO BORJA": "UBS Pedro Simplício",
  "PLANALTO SAMBAIBA": "UBS Dirceu Arcoverde",
  CATUMBI: "UBS Raimundo Filho",
  "SAO CRISTOVAO": "UBS Floriano (Centro)",
  TAMBORIL: "UBS Alfredo de Carvalho",
  "CONJUNTO PARAISO": "UBS Jasmina Bucar",
  CANCELA: "UBS Paulo Kalume",
  CANOAS: "UBS José Paraguassú",
  "PLANALTO BELA VISTA": "UBS Pedro Simplício",
  MELADAO: "UBS Pedro Simplício",
  VIAZUL: "UBS Raimundo Filho",
  "PEDRO SIMPLICIO": "UBS Pedro Simplício",
};

export default function Dashboard({ isPrivateView = false }) {
  const endemiasDisponiveis = isPrivateView
    ? ENDEMIAS
    : ENDEMIAS.filter((endemia) => endemia.id !== "violencia");

  const [endemiaSelecionada, setEndemiaSelecionada] = useState(
    endemiasDisponiveis[0],
  );

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL;
    fetch(`${baseUrl}${endemiaSelecionada.endpoint}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Erro HTTP! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setPacientes([]);
        setLoading(false);
      });
  }, [endemiaSelecionada]);

  // NOVO: Lógica de filtragem dos pacientes com base no período
  const pacientesFiltrados = useMemo(() => {
    if (filtroTipo === "todos") return pacientes;

    const hoje = new Date();
    let dataRefInicio = new Date();
    let dataRefFim = hoje;

    switch (filtroTipo) {
      case "ultimoMes":
        dataRefInicio.setMonth(hoje.getMonth() - 1);
        break;
      case "ultimos3Meses":
        dataRefInicio.setMonth(hoje.getMonth() - 3);
        break;
      case "ultimos6Meses":
        dataRefInicio.setMonth(hoje.getMonth() - 6);
        break;
      case "esteAno":
        dataRefInicio = new Date(hoje.getFullYear(), 0, 1);
        break;
      case "anoPassado":
        dataRefInicio = new Date(hoje.getFullYear() - 1, 0, 1);
        dataRefFim = new Date(hoje.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      case "personalizado":
        if (!dataInicio || !dataFim) return pacientes;
        // Adiciona o horário base para evitar problemas de fuso horário (Timezone)
        dataRefInicio = new Date(dataInicio + "T00:00:00");
        dataRefFim = new Date(dataFim + "T23:59:59");
        break;
      default:
        return pacientes;
    }

    return pacientes.filter((p) => {
      const dt = p.data_notificacao || p.dt_notific;
      if (!dt) return false;

      const [ano, mes, dia] = dt.split("-");
      const dataNotificacao = new Date(ano, mes - 1, dia);

      return dataNotificacao >= dataRefInicio && dataNotificacao <= dataRefFim;
    });
  }, [pacientes, filtroTipo, dataInicio, dataFim]);

  const obterBairroNormalizado = (endereco) => {
    if (!endereco) return "";
    const partes = endereco.split(",");
    let bairroStr = partes[partes.length - 1].trim();
    if (/^[0-9-]+$/.test(bairroStr) && partes.length >= 2) {
      bairroStr = partes[partes.length - 2].trim();
    } else if (/^[0-9-]+$/.test(bairroStr)) {
      return "";
    }
    return bairroStr
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const extrairBairroVisual = (endereco) => {
    if (!endereco) return "Não informado";
    const partes = endereco.split(",");
    let bairroStr = partes[partes.length - 1].trim();
    if (/^[0-9-]+$/.test(bairroStr) && partes.length >= 2) {
      bairroStr = partes[partes.length - 2].trim();
    } else if (/^[0-9-]+$/.test(bairroStr)) {
      return "CEP Genérico";
    }
    return bairroStr.charAt(0).toUpperCase() + bairroStr.slice(1).toLowerCase();
  };

  // ATENÇÃO: Todas as constantes abaixo passam a usar 'pacientesFiltrados' em vez de 'pacientes'
  const casosAlerta = pacientesFiltrados.filter((p) => {
    const classFinal = String(p.classi_fin || "").trim();
    return classFinal === "10" || classFinal === "11";
  }).length;

  const casosRecentes = [...pacientesFiltrados]
    .sort((a, b) => {
      const dateA = a.data_notificacao || "0000-00-00";
      const dateB = b.data_notificacao || "0000-00-00";
      return dateA !== dateB
        ? dateB.localeCompare(dateA)
        : (b.id || 0) - (a.id || 0);
    })
    .slice(0, 5)
    .map((paciente) => {
      const bairro = extrairBairroVisual(paciente.endereco);
      let ubsTag = "";
      if (endemiaSelecionada.id === "dengue") {
        ubsTag =
          BAIRRO_PARA_UBS[obterBairroNormalizado(paciente.endereco)] ||
          "Não Mapeada";
      } else {
        ubsTag = paciente.nm_ubs || paciente.un_saude || "Não informada";
      }
      const classFinal = String(paciente.classi_fin || "").trim();
      let statusCor = "bg-amber-500";
      if (classFinal === "10" || classFinal === "11") statusCor = "bg-rose-600";
      else if (classFinal === "5") statusCor = "bg-emerald-500";
      else if (classFinal === "8") statusCor = "bg-slate-400";
      return {
        name: `Caso #${paciente.numero_notificacao || "S/N"}`,
        condition: `Sintoma: ${paciente.data_pri_sintoma || "N/I"} | Sexo: ${paciente.cs_sexo || "N/I"}`,
        ubs: `UBS: ${ubsTag} | ${bairro}`,
        corClassificacao: statusCor,
        dadosOriginais: paciente,
      };
    });

  const contagemUbs = pacientesFiltrados.reduce((acc, paciente) => {
    let ubs = "Não Informada";
    if (endemiaSelecionada.id === "dengue") {
      const bairroNormalizado = obterBairroNormalizado(paciente.endereco);
      ubs = BAIRRO_PARA_UBS[bairroNormalizado] || "Outras Regiões";
    } else {
      const nomeAPI = paciente.nm_ubs || paciente.un_saude;
      if (nomeAPI) ubs = nomeAPI;
    }
    acc[ubs] = (acc[ubs] || 0) + 1;
    return acc;
  }, {});

  const maxCasosUbs = Math.max(...Object.values(contagemUbs), 1);
  const coresDistribuicao = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
  ];

  const distribuicaoUbs = Object.entries(contagemUbs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, valor], index) => ({
      name: nome,
      value: valor,
      max: maxCasosUbs,
      color: coresDistribuicao[index % coresDistribuicao.length],
    }));

  const ubsMaisAfetadaNome =
    Object.keys(contagemUbs).length > 0
      ? Object.keys(contagemUbs).reduce((a, b) =>
          contagemUbs[a] > contagemUbs[b] ? a : b,
        )
      : "Nenhuma";
  const ubsMaisAfetadaValor = contagemUbs[ubsMaisAfetadaNome] || 0;

  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  const casosUltimos7Dias = pacientesFiltrados.filter((p) => {
    const dt = p.data_notificacao || p.dt_notific;
    if (!dt) return false;
    const [ano, mes, dia] = dt.split("-");
    const dataNotificacao = new Date(ano, mes - 1, dia);
    return dataNotificacao >= seteDiasAtras && dataNotificacao <= hoje;
  }).length;

  const taxaNovosCasos =
    pacientesFiltrados.length > 0
      ? Math.round((casosUltimos7Dias / pacientesFiltrados.length) * 100)
      : 0;

  const totalNotificacoes =
    endemiaSelecionada.id === "tuberculose"
      ? pacientesFiltrados.reduce(
          (acc, p) => acc + Number(p.nu_notific || 0),
          0,
        )
      : pacientesFiltrados.length;

  const kpis = [
    {
      title: "Total de Notificações",
      value: totalNotificacoes,
      icon: Users,
      color: "blue",
      subtext: "Registros no período.",
    },
    {
      title: "Casos em Alerta (Graves)",
      value: casosAlerta,
      icon: AlertTriangle,
      color: "amber",
      subtext: "Graves/Sinais de alarme.",
    },
    {
      title: "UBS mais Afetada",
      value: ubsMaisAfetadaNome,
      icon: MapPin,
      color: "rose",
      subtext: `${ubsMaisAfetadaValor} casos registrados.`,
    },
    {
      title: "Últimos Casos (7 dias)",
      value: `${taxaNovosCasos}%`,
      icon: Activity,
      color: "emerald",
      subtext: `${casosUltimos7Dias} casos recentes.`,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      {isPrivateView ? (
        <SidebarPrivate
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col h-full w-full overflow-y-auto overflow-x-hidden ml-0 md:ml-[var(--sidebar-width,16rem)] transition-all duration-300">
        <header className="px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30 bg-[#4180ab]/90 backdrop-blur-md shadow-sm border-b border-white/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden group p-2 text-white bg-white/10 rounded-xl hover:bg-white/20 border border-transparent hover:border-white/10 transition-all duration-300"
              aria-label="Abrir menu"
            >
              <Menu className="size-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <Bell className="size-5" />
            </button>
            <button className="flex items-center gap-2 p-1 pr-3 hover:bg-white/10 rounded-full transition-colors">
              <UserCircle className="size-7" />
              <span className="text-sm font-medium hidden sm:block">Admin</span>
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6 w-full max-w-7xl mx-auto overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Dados Gerais - {endemiaSelecionada.nome}
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                Acompanhamento epidemiológico dos casos de{" "}
                {endemiaSelecionada.nome}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Seletor de Período Temporal */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-auto flex items-center bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-[#4180ab]/50 shadow-sm transition-all overflow-hidden">
                  <div className="pl-3 text-slate-400">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <select
                    value={filtroTipo}
                    onChange={(e) => {
                      setFiltroTipo(e.target.value);
                      // Limpa as datas personalizadas ao trocar de filtro para não prender o estado
                      if (e.target.value !== "personalizado") {
                        setDataInicio("");
                        setDataFim("");
                      }
                    }}
                    className="bg-transparent text-slate-700 font-medium px-3 py-2 pr-8 appearance-none focus:outline-none cursor-pointer w-full sm:w-auto text-sm"
                  >
                    <option value="todos">Todo o Período</option>
                    <option value="ultimoMes">Último Mês</option>
                    <option value="ultimos3Meses">Últimos 3 Meses</option>
                    <option value="ultimos6Meses">Últimos 6 Meses</option>
                    <option value="esteAno">Este Ano</option>
                    <option value="anoPassado">Ano Passado</option>
                    <option value="personalizado">Período Específico...</option>
                  </select>

                  <div className="absolute right-3 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Inputs para Período Personalizado (Renderização Condicional) */}
                {filtroTipo === "personalizado" && (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4180ab]/50 shadow-sm"
                    />
                    <span className="text-slate-400 font-medium text-sm">
                      até
                    </span>
                    <input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4180ab]/50 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Seletor de Endemia */}
              <EndemiaSelector
                options={endemiasDisponiveis}
                value={endemiaSelecionada}
                onChange={setEndemiaSelecionada}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw className="size-8 text-[#054060] animate-spin" />
            </div>
          ) : (
            <>
              {endemiaSelecionada.id === "violencia" && isPrivateView ? (
                <DashboardViolencia pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "sifilis" ? (
                <DashboardSifilis
                  pacientes={pacientesFiltrados}
                  distribuicaoUbs={distribuicaoUbs}
                />
              ) : endemiaSelecionada.id === "tuberculose" ? (
                <DashboardTuberculose pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "chagas" ? (
                <DashboardChagas pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "hanseniase" ? (
                <DashboardHanseniase pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "hepatite" ? (
                <DashboardHepatite pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "animaispec" ? (
                <DashboardAcidentes pacientes={pacientesFiltrados} />
              ) : endemiaSelecionada.id === "intoxicacao" ? (
                <DashboardIntoxicacao pacientes={pacientesFiltrados} />
              ) : (
                <>
                  <KpisGrid kpis={kpis} />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 overflow-hidden w-full">
                      <CurvaEpidemica pacientes={pacientesFiltrados} />
                    </div>
                    <div className="lg:col-span-1 overflow-hidden w-full">
                      <StatusDonut pacientes={pacientesFiltrados} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 overflow-hidden w-full">
                      <PerfilDemografico pacientes={pacientesFiltrados} />
                    </div>
                    <DistribuicaoQuadrante distribuicaoUbs={distribuicaoUbs} />
                    <CasosRecentes
                      casos={casosRecentes}
                      onSelectPaciente={(paciente) => {
                        setPacienteSelecionado(paciente);
                        setModalAberto(true);
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      <PatientModal
        isOpen={modalAberto}
        paciente={pacienteSelecionado}
        onClose={() => setModalAberto(false)}
      />
    </div>
  );
}
