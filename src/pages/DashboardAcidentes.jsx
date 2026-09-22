import React, { useMemo } from "react";
import {
  Users,
  Activity,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Paleta focada em tons de Laranja/Vermelho (Alerta/Urgência para Acidentes e Intoxicações)
const COLORS = ["#ea580c", "#f97316", "#dc2626", "#ef4444"];
const CORES_DISTRIBUICAO = [
  "bg-orange-600",
  "bg-orange-500",
  "bg-red-600",
  "bg-red-500",
  "bg-amber-600",
];

export default function DashboardAcidentes({ pacientes }) {
  // 1. Processamento de KPIs
  const totalCasos = pacientes.reduce(
    (sum, p) => sum + Number(p.nu_notific || 1), // Fallback para 1 caso o dado seja por linha
    0,
  );

  const unidadesAtivas = pacientes.length;

  const unidadeMaisAfetada = useMemo(() => {
    if (!pacientes.length) return { nome: "Nenhuma", casos: 0 };
    const maior = [...pacientes].sort(
      (a, b) => Number(b.nu_notific || 0) - Number(a.nu_notific || 0),
    )[0];
    return {
      nome: maior.nm_ubs || maior.hospital || "Desconhecida",
      casos: maior.nu_notific || 1,
    };
  }, [pacientes]);

  const mediaPorUnidade =
    unidadesAtivas > 0 ? (totalCasos / unidadesAtivas).toFixed(1) : 0;

  // 2. Gráfico de Distribuição por Unidade (Top 5)
  const distribuicaoUbs = useMemo(() => {
    const top5 = [...pacientes]
      .sort((a, b) => Number(b.nu_notific || 0) - Number(a.nu_notific || 0))
      .slice(0, 5);

    const maxCasosUbs = top5.length > 0 ? Number(top5[0].nu_notific || 0) : 1;

    return top5.map((unidade, index) => ({
      name: unidade.nm_ubs || unidade.hospital || "Não informada",
      value: Number(unidade.nu_notific || 1),
      max: maxCasosUbs,
      color: CORES_DISTRIBUICAO[index % CORES_DISTRIBUICAO.length],
    }));
  }, [pacientes]);

  // 3. Gráfico de Rosca: Perfil de Atendimento (Atenção Básica vs Urgência/Hospitalar)
  const dadosCategorias = useMemo(() => {
    let ubs = 0;
    let urgenciaHospitalar = 0;

    pacientes.forEach((p) => {
      const nome = String(p.nm_ubs || p.hospital || "").toUpperCase();
      const casos = Number(p.nu_notific || 1);

      // Casos de intoxicação/animais peçonhentos costumam ir mais para Hospitais/UPAs
      if (
        nome.includes("UBS") ||
        nome.includes("POSTO") ||
        nome.includes("ESF")
      ) {
        ubs += casos;
      } else {
        urgenciaHospitalar += casos;
      }
    });

    return [
      { name: "Atenção Básica (UBS)", value: ubs },
      { name: "Urgência / Especializada", value: urgenciaHospitalar },
    ].filter((d) => d.value > 0);
  }, [pacientes]);

  // 4. Tabela de Unidades
  const listaUnidades = [...pacientes].sort(
    (a, b) => Number(b.nu_notific || 0) - Number(a.nu_notific || 0),
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Linha 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Total de Ocorrências"
          value={totalCasos}
          icon={Users}
          color="bg-orange-600"
          bgLight="bg-orange-50"
          subtitle="Notificações consolidadas"
        />
        <KpiCard
          title="Unidades com Casos"
          value={unidadesAtivas}
          icon={MapPin}
          color="bg-red-500"
          bgLight="bg-red-50"
          subtitle="Cobertura de atendimento"
        />
        <KpiCard
          title="Unidade de Maior Foco"
          value={unidadeMaisAfetada.casos}
          icon={Siren}
          color="bg-orange-500"
          bgLight="bg-orange-50"
          subtitle={unidadeMaisAfetada.nome?.substring(0, 20)}
        />
        <KpiCard
          title="Média por Unidade"
          value={mediaPorUnidade}
          icon={Activity}
          color="bg-amber-600"
          bgLight="bg-amber-50"
          subtitle="Casos / Unidade"
        />
      </div>

      {/* Linha 2: Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Distribuição por Unidade (Top 5)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Locais com maior volume de atendimentos de urgência
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-5 mt-4">
            {distribuicaoUbs.map((item, index) => {
              const percent =
                item.max > 0 ? Math.round((item.value / item.max) * 100) : 0;
              return (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${item.color}`}
                      ></span>
                      <span className="font-medium text-slate-700">
                        {index === 0 && item.value > 0 && (
                          <span className="mr-1.5">🏆</span>
                        )}
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldAlert className="size-5 text-orange-600" /> Perfil da Rede
          </h3>
          <div className="flex-1 min-h-[200px] sm:min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosCategorias}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosCategorias.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} ocorrências`, "Total"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 justify-center mt-2">
            {dadosCategorias.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-600"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  <span className="truncate max-w-[150px]">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linha 3: Tabela Consolidada de Unidades */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 w-full overflow-hidden">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
          Detalhamento por Ponto de Atendimento
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg whitespace-nowrap">
                  Instituição (NM UBS / Hospital)
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  Código CNES
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
              {listaUnidades.map((unidade, idx) => {
                const nomeUbs = String(
                  unidade.nm_ubs || unidade.hospital || "",
                ).toUpperCase();

                const isEspecializada = !(
                  nomeUbs.includes("UBS") ||
                  nomeUbs.includes("POSTO") ||
                  nomeUbs.includes("ESF")
                );

                return (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2 whitespace-nowrap">
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          isEspecializada
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {isEspecializada ? "H" : "U"}
                      </div>
                      {unidade.nm_ubs || unidade.hospital || "Não informada"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {unidade.id_unidade || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold inline-block ${
                          isEspecializada
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-orange-50 text-orange-600 border border-orange-200"
                        }`}
                      >
                        {isEspecializada
                          ? "Urgência/Hospital"
                          : "Atenção Básica"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                        {unidade.nu_notific || 1}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {listaUnidades.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    Nenhum registro encontrado.
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

// Subcomponente de KPI mantido para isolamento no mesmo arquivo
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
