import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Users } from "lucide-react";

const FAIXAS = [
  { key: "0-9", min: 0, max: 9, cor: "#06b6d4" },
  { key: "10-19", min: 10, max: 19, cor: "#3b82f6" },
  { key: "20-39", min: 20, max: 39, cor: "#8b5cf6" },
  { key: "40-59", min: 40, max: 59, cor: "#f59e0b" },
  { key: "60+", min: 60, max: 200, cor: "#ef4444" },
];

export default function PerfilFaixaEtaria({ pacientes = [] }) {
  const dados = useMemo(() => {
    const contagem = Object.fromEntries(FAIXAS.map((f) => [f.key, 0]));

    pacientes.forEach((p) => {
      // Tenta calcular idade pela data_nascimento
      let idade = null;
      if (p.data_nascimento) {
        const nasc = new Date(p.data_nascimento);
        if (!isNaN(nasc)) {
          const hoje = new Date();
          idade =
            hoje.getFullYear() -
            nasc.getFullYear() -
            (hoje <
            new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())
              ? 1
              : 0);
        }
      }

      // Fallback: se não tem idade, joga em "20-39" (mais provável)
      if (idade === null || idade < 0 || idade > 130) idade = 25;

      const faixa = FAIXAS.find((f) => idade >= f.min && idade <= f.max);
      if (faixa) contagem[faixa.key]++;
    });

    return FAIXAS.map((f) => ({
      faixa: f.key,
      casos: contagem[f.key],
      cor: f.cor,
    }));
  }, [pacientes]);

  const totalComIdade = dados.reduce((s, d) => s + d.casos, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <Users className="size-5 text-[#4180ab]" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">Faixa Etária</h3>
          <p className="text-sm text-slate-500">
            Perfil de idade dos pacientes notificados
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        {totalComIdade === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Sem dados de data de nascimento.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="faixa"
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
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`${value} casos`, "Total"]}
              />
              <Bar dataKey="casos" radius={[4, 4, 0, 0]}>
                {dados.map((entry, idx) => (
                  <Cell key={idx} fill={entry.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
