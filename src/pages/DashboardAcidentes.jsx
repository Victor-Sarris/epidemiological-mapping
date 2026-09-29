import React, { useMemo } from "react";
import {
  Users,
  Calendar,
  AlertTriangle,
  Activity,
  FlaskConical,
} from "lucide-react";
import {
  AreaChart, // Importações alteradas para gerar curvas
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardIntoxicacao({ pacientes = [] }) {
  // 1. Processamento e Agrupamento de Dados (Robustez nas chaves)
  const dadosEvolucao = useMemo(() => {
    const agrupado = pacientes.reduce((acc, p) => {
      // Captura o ano e número independente de como a chave venha escrita do importador
      const anoRaw = p.ano_notific || p["ANO NOTIFIC"] || p.ano || "N/I";
      const casosRaw =
        p.nu_notific || p["NU NOTIFIC"] || p.casos || p.total || 1;

      const ano = String(anoRaw);
      const casos = Number(casosRaw) || 0;

      if (!acc[ano]) {
        acc[ano] = 0;
      }
      acc[ano] += casos;
      return acc;
    }, {});

    // Converte o objeto em array e ordena cronologicamente
    return Object.entries(agrupado)
      .map(([ano, casos]) => ({ ano, casos }))
      .sort((a, b) => {
        if (a.ano === "N/I") return -1;
        if (b.ano === "N/I") return 1;
        return Number(a.ano) - Number(b.ano);
      });
  }, [pacientes]);

  // 2. Processamento de KPIs usando os dados tratados
  const totalCasos = dadosEvolucao.reduce((sum, item) => sum + item.casos, 0);

  // Conta apenas anos válidos para a média
  const anosValidos = dadosEvolucao.filter((item) => item.ano !== "N/I").length;
  const anosAtivos = anosValidos > 0 ? anosValidos : 1;

  const anoMaisAfetado = useMemo(() => {
    if (!dadosEvolucao.length) return { ano: "Nenhum", casos: 0 };
    return [...dadosEvolucao].sort((a, b) => b.casos - a.casos)[0];
  }, [dadosEvolucao]);

  const mediaPorAno =
    anosValidos > 0 ? (totalCasos / anosValidos).toFixed(1) : 0;

  // 3. Tabela de Consolidação
  const listaAnos = [...dadosEvolucao].sort(
    (a, b) => Number(b.ano) - Number(a.ano),
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Linha 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Total de Ocorrências"
          value={totalCasos}
          icon={Users}
          color="bg-purple-600"
          bgLight="bg-purple-50"
          subtitle="Notificações consolidadas"
        />
        <KpiCard
          title="Anos Registados"
          value={anosValidos}
          icon={Calendar}
          color="bg-indigo-500"
          bgLight="bg-indigo-50"
          subtitle="Período de cobertura"
        />
        <KpiCard
          title="Ano com Mais Casos"
          value={anoMaisAfetado.casos}
          icon={AlertTriangle}
          color="bg-rose-500"
          bgLight="bg-rose-50"
          subtitle={`Ano de ${anoMaisAfetado.ano}`}
        />
        <KpiCard
          title="Média por Ano"
          value={mediaPorAno}
          icon={Activity}
          color="bg-blue-500"
          bgLight="bg-blue-50"
          subtitle="Casos anuais"
        />
      </div>

      {/* Linha 2: Gráfico de Curva Anual */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 w-full h-80 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FlaskConical className="size-5 text-purple-600" /> Evolução Anual de
          Intoxicações
        </h3>
        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dadosEvolucao}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Criação de um gradiente para o preenchimento da curva */}
                <linearGradient id="colorCasos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="ano"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone" // Este atributo transforma as linhas retas em curvas suaves
                dataKey="casos"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCasos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Linha 3: Tabela Consolidada de Anos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 w-full overflow-hidden">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
          Detalhamento por Ano
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap">
                  Ano de Notificação
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  Classificação
                </th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg whitespace-nowrap text-right">
                  Total de Casos
                </th>
              </tr>
            </thead>
            <tbody>
              {listaAnos.map((anoItem, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2 whitespace-nowrap">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold bg-purple-100 text-purple-700">
                      A
                    </div>
                    Consolidado {anoItem.ano}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold inline-block bg-slate-50 text-slate-600 border border-slate-200">
                      Registo Municipal Anual
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                      {anoItem.casos}
                    </span>
                  </td>
                </tr>
              ))}
              {listaAnos.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    Nenhum registo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
