import React, { useState } from "react";
import { Bug, Activity, ShieldAlert, Menu, ChevronDown } from "lucide-react";

export default function EndemiasFilter({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const endemias = [
    {
      id: "gerais",
      name: "Endemias Gerais",
      icon: Bug,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
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

  const selectedItem =
    endemias.find((item) => item.id === selected) || endemias[0];

  return (
    <div className="absolute top-4 left-6 z-20 flex flex-col items-start">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-200/60 hover:bg-white transition-all active:scale-95"
      >
        <Menu className="size-5 text-slate-600" />
        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Filtro de Agravos
        </span>
        <ChevronDown
          className={`size-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Lista Expandível */}
      {isOpen && (
        <div className="mt-2 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/60 w-full animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
            Selecione o Agravo
          </h4>
          <div className="flex flex-col gap-2">
            {endemias.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
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
      )}
    </div>
  );
}
