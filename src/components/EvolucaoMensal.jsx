// EvolucaoMensal.jsx
import React, { useMemo } from "react";
import {
  AreaChart, // Mudamos de LineChart para AreaChart
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  defs, // Importante para o gradiente
  linearGradient,
  stop,
} from "recharts";
import { Activity } from "lucide-react";

export default function EvolucaoMensal({ pacientes = [], escopo = "unidade" }) {
  const dados = useMemo(() => {
    const contagem = {};
    pacientes.forEach((p) => {
      const dt = p.data_notificacao || p.dt_notific;
      if (!dt) return;
      const data = new Date(dt);
      if (isNaN(data)) return;
      const mesAno = `${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
      contagem[mesAno] = (contagem[mesAno] || 0) + 1;
    });

    return Object.entries(contagem)
      .map(([data, casos]) => ({ data, casos }))
      .sort((a, b) => {
        const [mA, aA] = a.data.split("/");
        const [mB, aB] = b.data.split("/");
        return Number(aA + mA) - Number(aB + mB);
      })
      .slice(-12);
  }, [pacientes]);

  const subtitulo =
    escopo === "unidade"
      ? "Últimos 12 meses na unidade"
      : "Últimos 12 meses no município";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="size-5 text-[#4180ab]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Evolução Mensal
            </h3>
            <p className="text-sm text-slate-500">{subtitulo}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        {dados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Activity className="size-8 mb-2 opacity-50" />
            <p className="text-sm">Sem dados suficientes.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dados}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCasos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4180ab" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4180ab" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="data"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(4px)",
                }}
                formatter={(value) => [`${value} casos`, "Total"]}
                labelStyle={{
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              />
              <Area
                type="monotone"
                dataKey="casos"
                stroke="#4180ab"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCasos)"
                dot={{ r: 4, fill: "#4180ab", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#054060" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
