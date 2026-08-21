import React from "react";
import { Bug, Activity, ShieldAlert } from "lucide-react";

export default function EndemiaFilter({ selected, onChange }) {
  const endemias = [
    {
      id: "dengue",
      name: "Dengue",
      icon: Bug,
      color: "text-rose-500",
      bg: "bg-rose-100",
    },
    {
      id: "sifilis",
      name: "Sífilis",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      id: "tuberculose",
      name: "Tuberculose",
      icon: ShieldAlert,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="absolute top-4 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/60">
      <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
        Selecione o Agravo
      </h4>
      <div className="flex flex-col gap-2">
        {endemias.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selected === item.id
                ? "bg-slate-100 ring-1 ring-slate-300 shadow-sm"
                : "hover:bg-slate-50 opacity-70 hover:opacity-100"
            }`}
          >
            <div className={`p-1.5 rounded-md ${item.bg} ${item.color}`}>
              <item.icon className="size-4" />
            </div>
            <span className="text-slate-700">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
