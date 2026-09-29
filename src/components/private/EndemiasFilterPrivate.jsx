import React, { useState, useRef, useEffect } from "react";
import {
  Bug,
  Activity,
  ShieldAlert,
  ChevronDown,
  MapPlus,
  HeartPulse,
  Hand,
  Droplets,
  HeartHandshake,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EndemiasFilter({
  selected,
  onChange,
  className,
  isPrivateView = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const todasOpcoes = [
    {
      id: "gerais",
      name: "Território de UBS",
      shortName: "Território",
      icon: MapPlus,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      hoverBg: "hover:bg-yellow-50",
      rota: "/profissional/mapa-epidemiologico",
    },
    {
      id: "dengue",
      name: "Dengue",
      shortName: "Dengue",
      icon: Bug,
      color: "text-rose-600",
      bg: "bg-rose-100",
      hoverBg: "hover:bg-rose-50",
      rota: "/profissional/mapa-epidemiologico/endemias/dengue",
    },
    {
      id: "sifilis",
      name: "Sífilis",
      shortName: "Sífilis",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-100",
      hoverBg: "hover:bg-purple-50",
      rota: "/profissional/mapa-epidemiologico/endemias/sifi",
    },
    {
      id: "tuberculose",
      name: "Tuberculose",
      shortName: "Tuberculose",
      icon: ShieldAlert,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      hoverBg: "hover:bg-emerald-50",
      rota: "/profissional/mapa-epidemiologico/endemias/tuberculose",
    },
    {
      id: "chagas",
      name: "Chagas",
      shortName: "Chagas",
      icon: HeartPulse,
      color: "text-orange-600",
      bg: "bg-orange-100",
      hoverBg: "hover:bg-orange-50",
      rota: "/profissional/mapa-epidemiologico/endemias/chagas",
    },
    {
      id: "hanseniase",
      name: "Hanseníase",
      shortName: "Hanseníase",
      icon: Hand,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-100",
      hoverBg: "hover:bg-fuchsia-50",
      rota: "/profissional/mapa-epidemiologico/endemias/hanseniase",
    },
    {
      id: "hepatite",
      name: "Hepatite",
      shortName: "Hepatite",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-100",
      hoverBg: "hover:bg-blue-50",
      rota: "/profissional/mapa-epidemiologico/endemias/hepatite",
    },
    {
      id: "violenciadom",
      name: "Violência Doméstica",
      shortName: "Violência",
      icon: HeartHandshake,
      color: "text-rose-700",
      bg: "bg-rose-100",
      hoverBg: "hover:bg-rose-50",
      rota: "/profissional/mapa-epidemiologico/endemias/violenciadom",
    },
  ];

  // ✅ CORREÇÃO: filtro usa o ID real (violenciadom)
  const endemias = isPrivateView
    ? todasOpcoes
    : todasOpcoes.filter((opt) => opt.id !== "violenciadom");

  const selectedItem =
    endemias.find((item) => item.id === selected) || endemias[0];

  // Fecha ao clicar fora + ESC
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelection = (item) => {
    if (onChange) {
      try {
        onChange(item.id);
      } catch (e) {
        console.error("Erro ao atualizar o estado:", e);
      }
    }
    setIsOpen(false);
    if (item.rota) {
      navigate(item.rota);
    }
  };

  const SelectedIcon = selectedItem.icon;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-4 left-4 md:top-6 md:left-6 z-20 ${className || ""}`}
    >
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Selecionar agravo"
        className={`group flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md pl-2 pr-3 sm:pl-2.5 sm:pr-4 py-2 rounded-xl sm:rounded-2xl shadow-lg border transition-all duration-300 cursor-pointer hover:shadow-xl active:scale-95 ${
          isOpen
            ? "border-[#4180ab]/50 ring-2 ring-[#4180ab]/20"
            : "border-slate-200/70 hover:border-slate-300"
        }`}
      >
        <div
          className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${selectedItem.bg} ${selectedItem.color} transition-transform group-hover:scale-105`}
        >
          <SelectedIcon className="size-4" />
        </div>

        <div className="flex flex-col items-start min-w-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none hidden sm:block">
            Agravo
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
            {selectedItem.name}
          </span>
        </div>

        <ChevronDown
          className={`size-4 text-slate-500 shrink-0 transition-transform duration-300 ml-1 ${
            isOpen ? "rotate-180 text-[#4180ab]" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-left w-72 sm:w-80">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Selecione o Agravo
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {endemias.length} disponíveis
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#4180ab]/10 flex items-center justify-center">
              <SelectedIcon className="size-3 text-[#4180ab]" />
            </div>
          </div>

          {/* Lista em grid 2 colunas */}
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {endemias.map((item) => {
                const Icon = item.icon;
                const isActive = selected === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelection(item)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? "bg-[#4180ab]/10 ring-2 ring-[#4180ab]/30"
                        : `${item.hoverBg} hover:shadow-sm`
                    }`}
                  >
                    {/* Check no item ativo */}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#4180ab] flex items-center justify-center">
                        <Check
                          className="size-2.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    <div
                      className={`p-2 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <span
                      className={`text-[11px] font-semibold text-center leading-tight ${
                        isActive ? "text-[#4180ab]" : "text-slate-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
