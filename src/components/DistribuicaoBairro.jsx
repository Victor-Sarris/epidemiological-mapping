// DistribuicaoQuadrante.jsx (Aplique a mesma lógica para DistribuicaoBairro)
import React from "react";

export default function DistribuicaoUbs({ distribuicaoUbs }) {
  const ubsOrdenadas = [...distribuicaoUbs].sort((a, b) => b.value - a.value);
  const total = ubsOrdenadas.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">
          Distribuição por UBS
        </h3>
        <p className="text-sm text-slate-500">Áreas com mais casos de dengue</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {ubsOrdenadas.map((item, idx) => {
          const porcentagem =
            total > 0 ? Math.round((item.value / total) * 100) : 0;

          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-slate-700 flex items-center gap-2 min-w-0 text-sm">
                  <span
                    className={`size-2.5 rounded-full shrink-0 ${item.color} shadow-sm`}
                  ></span>
                  <span className="truncate">
                    {idx === 0 ? `🚨 ${item.name}` : item.name}
                  </span>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-400">
                    {porcentagem}%
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm bg-slate-50 px-2 py-0.5 rounded-md">
                    {item.value}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out group-hover:brightness-110`}
                  style={{
                    width: `${Math.max((item.value / item.max) * 100, 4)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
