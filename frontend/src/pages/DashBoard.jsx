import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import {
  Users,
  Activity,
  Bug,
  AlertTriangle,
  Map,
  ArrowRight,
  Calendar,
  Clock,
  RefreshCw,
  Bell,
  UserCircle,
} from "lucide-react";

function Dashboard() {
  const getColorClasses = (color) => {
    const map = {
      blue: "border-l-blue-500 text-blue-600 bg-blue-50",
      emerald: "border-l-emerald-500 text-emerald-600 bg-emerald-50",
      amber: "border-l-amber-500 text-amber-600 bg-amber-50",
      rose: "border-l-rose-500 text-rose-600 bg-rose-50",
    };
    return map[color];
  };

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/pacientes/")
      .then((response) => response.json())
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando os dados...</p>;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto ml-62.5">
        {/* Header Superior */}
        <header className="px-8 py-4 border-b bg-white flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-800">Visão Geral</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              <UserCircle className="size-6 text-slate-400" />
              <span>Gestor Saúde</span>
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Título e Botão de Atualizar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Acompanhamento epidemiológico de Floriano, PI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">
                Última atualização: Agora
              </span>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 transition-all active:scale-95">
                <RefreshCw className="size-4 text-slate-500" />
                Atualizar
              </button>
            </div>
          </div>

          {/* Grid de KPIs (4 Cards no topo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => {
              const colors = getColorClasses(kpi.color);
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-l-4 ${colors.split(" ")[0]} flex flex-col justify-between`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        {kpi.title}
                      </p>
                      <h3 className="text-3xl font-bold text-slate-800">
                        {kpi.value}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-lg ${colors.split(" ")[2]}`}>
                      <kpi.icon className={`size-5 ${colors.split(" ")[1]}`} />
                    </div>
                  </div>
                  <p className="text-xs font-medium mt-4 text-slate-400">
                    <span
                      className={
                        kpi.color === "rose"
                          ? "text-rose-500"
                          : kpi.color === "emerald"
                            ? "text-emerald-500"
                            : ""
                      }
                    >
                      {kpi.subtext.split(" ")[0]}
                    </span>
                    {" " + kpi.subtext.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Layout de 3 Colunas (Distribuição, Recentes, Próximas Ações) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Distribuição por Setor */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Distribuição por Quadrante
                </h3>
                <p className="text-sm text-slate-500">
                  Casos por área de referência (UBS)
                </p>
              </div>
              <div className="flex-1 space-y-5">
                {distribuicaoUbs.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-600 flex items-center gap-2">
                        <span
                          className={`size-2.5 rounded-full ${item.color}`}
                        ></span>
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-700">
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                <Map className="size-4" />
                Ver mapa completo
              </button>
            </div>

            {/* Coluna 2: Casos Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Casos Recentes
                </h3>
                <p className="text-sm text-slate-500">
                  Últimos registros inseridos
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {casosRecentes.map((caso, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full bg-${caso.status}-500 shadow-sm shadow-${caso.status}-200`}
                      ></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {caso.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {caso.condition} • {caso.ubs}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                <Users className="size-4" />
                Ver todos os casos
              </button>
            </div>

            {/* Coluna 3: Próximas Ações */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Próximas Ações
                </h3>
                <p className="text-sm text-slate-500">
                  Agendamentos e intervenções
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {proximasAcoes.map((acao, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                      <Calendar className="size-5" />
                    </div>
                    <div className="flex-1 border-b border-slate-50 pb-4">
                      <p className="text-sm font-bold text-slate-800 mb-0.5">
                        {acao.title}
                      </p>
                      <p className="text-xs text-slate-500 mb-1">
                        {acao.location}
                      </p>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="size-3" />
                        {acao.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-2 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                <Calendar className="size-4" />
                Ver calendário
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
