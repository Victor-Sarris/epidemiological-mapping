import React, { useState, useEffect, useMemo } from "react";
import SidebarPrivate from "@/components/private/SidebarPrivate.jsx";
import {
  Users,
  Activity,
  Target,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

// Componente auxiliar de Card de KPI (pode ser o mesmo que vc já usa nos outros dashboards)
function KpiCard({ title, value, icon: Icon, color, bgLight, subtitle }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 sm:gap-4 transition-transform hover:-translate-y-1 duration-300">
      <div
        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${bgLight}`}
      >
        <Icon className={`size-6 sm:size-7 ${color.replace("bg-", "text-")}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-500 truncate">
          {title}
        </p>
        <h4 className="text-xl sm:text-2xl font-black text-slate-800 truncate">
          {value}
        </h4>
        {subtitle && (
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardCoberturaVacinal({ isPrivateView = true }) {
  const [dadosVacinais, setDadosVacinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ano atual focado no painel (pode vir de um seletor no futuro)
  const anoVigente = 2026;

  // Busca os dados da API Django que você criou
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        // Chama a rota que foi registrada no urls.py
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

  const dadosDoAno = useMemo(() => {
    return dadosVacinais.filter((item) => item.ano === anoVigente);
  }, [dadosVacinais, anoVigente]);

  // Calcula KPIs
  const metaAtingida = dadosDoAno.filter(
    (d) => d.cobertura_percentual >= d.meta_otima,
  ).length;
  const totalImunobiologicos = dadosDoAno.length;
  const mediaCobertura =
    totalImunobiologicos > 0
      ? (
          dadosDoAno.reduce((acc, curr) => acc + curr.cobertura_percentual, 0) /
          totalImunobiologicos
        ).toFixed(1)
      : 0;

  // Função para definir a cor baseada no atingimento da meta
  const getColorPorCobertura = (cobertura, meta) => {
    if (cobertura >= meta) return "#0f9d58"; // Verde (Meta atingida)
    if (cobertura >= meta * 0.8) return "#f9a825"; // Amarelo (Atenção)
    return "#c2185b"; // Vermelho (Baixa cobertura)
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      <SidebarPrivate
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto overflow-x-hidden ml-0 md:ml-[var(--sidebar-width,16rem)] transition-all duration-300">
        <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-30 bg-[#4180ab] shadow-sm border-b border-[#043048]/20">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="size-5 md:size-6" />
            <h2 className="text-lg md:text-xl font-bold tracking-wide">
              Cobertura Vacinal Infantil - {anoVigente}
            </h2>
          </div>
        </header>

        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Activity className="size-8 text-[#4180ab] animate-spin" />
            </div>
          ) : (
            <>
              {/* Linha 1: KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <KpiCard
                  title="Imunobiológicos Monitorados"
                  value={totalImunobiologicos}
                  icon={Activity}
                  color="bg-blue-600"
                  bgLight="bg-blue-50"
                  subtitle={`Base ano ${anoVigente}`}
                />
                <KpiCard
                  title="Média Geral de Cobertura"
                  value={`${mediaCobertura}%`}
                  icon={Users}
                  color="bg-indigo-500"
                  bgLight="bg-indigo-50"
                  subtitle="Média agregada municipal"
                />
                <KpiCard
                  title="Metas Atingidas"
                  value={`${metaAtingida} de ${totalImunobiologicos}`}
                  icon={Target}
                  color="bg-emerald-500"
                  bgLight="bg-emerald-50"
                  subtitle="Cobertura >= 95%"
                />
                <KpiCard
                  title="Em Situação de Risco"
                  value={totalImunobiologicos - metaAtingida}
                  icon={AlertCircle}
                  color="bg-rose-500"
                  bgLight="bg-rose-50"
                  subtitle="Abaixo da meta recomendada"
                />
              </div>

              {/* Linha 2: Gráfico Principal de Cobertura */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 w-full h-[400px] flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#4180ab]" /> Status de
                  Cobertura por Vacina
                </h3>

                <div className="flex-1 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosDoAno}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      barSize={40}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="imunobiologico"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Cobertura"]}
                      />
                      {/* Linha de Meta Geral Padrão (95%) */}
                      <ReferenceLine
                        y={95}
                        stroke="#c2185b"
                        strokeDasharray="3 3"
                        label={{
                          position: "top",
                          value: "Meta (95%)",
                          fill: "#c2185b",
                          fontSize: 12,
                        }}
                      />

                      <Bar dataKey="cobertura_percentual" radius={[4, 4, 0, 0]}>
                        {dadosDoAno.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getColorPorCobertura(
                              entry.cobertura_percentual,
                              entry.meta_otima,
                            )}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Linha 3: Tabela Detalhada */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 w-full overflow-hidden">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
                  Detalhamento dos Imunobiológicos
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap">
                          Imunobiológico
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap text-center">
                          Meta Ótima
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap text-center">
                          Cobertura Atual
                        </th>
                        <th className="px-4 py-3 font-semibold rounded-tr-lg whitespace-nowrap text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosDoAno.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                            {item.imunobiologico}
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="text-slate-500 font-semibold">
                              {item.meta_otima}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="font-bold text-slate-800">
                              {item.cobertura_percentual}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {item.cobertura_percentual >= item.meta_otima ? (
                              <span className="px-2 py-1 rounded-md text-xs font-bold inline-block bg-emerald-50 text-emerald-600 border border-emerald-200">
                                Meta Atingida
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-md text-xs font-bold inline-block bg-rose-50 text-rose-600 border border-rose-200">
                                Abaixo da Meta
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {dadosDoAno.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-slate-400"
                          >
                            Nenhum dado processado para o ano atual.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
