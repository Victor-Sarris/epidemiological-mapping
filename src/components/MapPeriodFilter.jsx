import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";

const PERIODO_OPTIONS = [
  { value: "todos", label: "Todo o Período" },
  { value: "ultimoMes", label: "Último Mês" },
  { value: "ultimos3Meses", label: "Últimos 3 Meses" },
  { value: "ultimos6Meses", label: "Últimos 6 Meses" },
  { value: "esteAno", label: "Este Ano" },
  { value: "anoPassado", label: "Ano Passado" },
  { value: "personalizado", label: "Período Específico..." },
];

export default function MapPeriodFilter({
  filtroTipo,
  setFiltroTipo,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setFiltroTipo(value);
    if (value !== "personalizado") {
      setDataInicio("");
      setDataFim("");
      setIsOpen(false); // Fecha só se não for personalizado
    }
  };

  const selectedLabel =
    PERIODO_OPTIONS.find((opt) => opt.value === filtroTipo)?.label ||
    "Selecione";

  return (
    <div ref={dropdownRef} className={`relative ${className || ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 pl-3 pr-2 py-2 h-11 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border transition-all duration-300 cursor-pointer hover:bg-white hover:shadow-xl active:scale-95 ${
          isOpen
            ? "ring-2 ring-[#4180ab]/30 border-[#4180ab]/40"
            : "border-slate-200/60"
        }`}
      >
        <CalendarDays
          className={`size-4 shrink-0 transition-colors ${
            isOpen
              ? "text-[#4180ab]"
              : "text-slate-400 group-hover:text-[#4180ab]"
          }`}
        />
        <span className="text-sm font-semibold text-slate-700 max-w-[110px] sm:max-w-none truncate">
          {selectedLabel}
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Filtrar por Período
            </p>
          </div>

          <div className="p-1.5 max-h-72 overflow-y-auto">
            {PERIODO_OPTIONS.map((opt) => {
              const isActive = filtroTipo === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-[#4180ab]/10 text-[#4180ab]"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold truncate ${isActive ? "text-[#4180ab]" : "text-slate-700"}`}
                  >
                    {opt.label}
                  </span>
                  {isActive && (
                    <Check className="size-4 shrink-0 text-[#4180ab]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Inputs de data para período personalizado */}
          {filtroTipo === "personalizado" && (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2 animate-in slide-in-from-top-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4180ab]/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4180ab]/50"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-1 w-full bg-[#4180ab] hover:bg-[#054060] text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Aplicar Filtro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
