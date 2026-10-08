import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
      ? "Últimos 12 meses de notificação na unidade"
      : "Últimos 12 meses de notificação no município";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-[#4180ab]" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">Evolução Mensal</h3>
          <p className="text-sm text-slate-500">{subtitulo}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        {dados.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Sem dados suficientes.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dados}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`${value} casos`, "Total"]}
              />
              <Line
                type="monotone"
                dataKey="casos"
                stroke="#4180ab"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4180ab", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
