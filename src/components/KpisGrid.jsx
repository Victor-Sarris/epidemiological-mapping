// KpisGrid.jsx
import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default function KpisGrid({ kpis }) {
  const getColorClasses = (color) => {
    const map = {
      blue: {
        border: "border-l-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
      },
      emerald: {
        border: "border-l-emerald-500",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      amber: {
        border: "border-l-amber-500",
        text: "text-amber-600",
        bg: "bg-amber-50",
      },
      rose: {
        border: "border-l-rose-500",
        text: "text-rose-600",
        bg: "bg-rose-50",
      },
      green: {
        border: "border-l-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
      },
    };
    return map[color] || map.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi, idx) => {
        const colors = getColorClasses(kpi.color);
        // Simulação de tendência (você pode passar isso via props no futuro)
        const trend = idx % 2 === 0 ? "up" : "down";

        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 p-5 md:p-6 border-l-4 ${colors.border} flex flex-col justify-between group`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {kpi.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform duration-300`}
              >
                <kpi.icon className="size-6" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs font-medium text-slate-400">
                {kpi.subtext}
              </p>
              {/* Indicador de tendência visual */}
              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  trend === "up"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {trend === "up" ? "12%" : "5%"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
