import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Activity,
  CircleQuestionMark,
  X,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dados Gerais" },
  { path: "/mapa-epidemiologico", icon: Map, label: "Mapa Epidemiológico" },
  { path: "/suporte", icon: CircleQuestionMark, label: "Dúvidas Frequentes" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "5rem" : "16rem",
    );
  }, [isCollapsed]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Botão de Encolher */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 z-50 hover:bg-slate-50 transition-transform duration-300 shadow-sm cursor-pointer"
        >
          <ChevronLeft
            className={`size-4 text-slate-500 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Cabeçalho / Logo */}
        <div
          className={`h-18 flex items-center ${
            isCollapsed ? "justify-center px-0" : "justify-between px-6"
          } border-b border-slate-100 transition-all duration-300`}
        >
          <Link
            to="/"
            className={`flex items-center group cursor-pointer ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
            onClick={onClose}
          >
            <div className="bg-[#054060]/10 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Activity className="size-5 text-[#4180ab]" />
            </div>
            <span
              className={`text-xl font-black tracking-tight text-slate-900 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100"
              }`}
            >
              Epi<span className="text-[#4180ab]">Data</span>
            </span>
          </Link>

          {!isCollapsed && (
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 custom-scrollbar">
          <p
            className={`px-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isCollapsed
                ? "max-h-0 opacity-0 mb-0"
                : "max-h-10 opacity-100 mb-4"
            }`}
          >
            Menu Principal
          </p>

          <ul className="space-y-1.5">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={onClose}
                    title={isCollapsed ? label : ""}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center px-0" : "px-4 gap-3"
                    } py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                      active
                        ? "bg-[#4180ab] text-white shadow-lg shadow-[#054060]/20 md:translate-x-1"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#054060] md:hover:translate-x-1"
                    }`}
                  >
                    <Icon
                      className={`size-5 shrink-0 transition-colors duration-300 ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#054060]"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                        isCollapsed
                          ? "max-w-0 opacity-0"
                          : "max-w-[200px] opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Rodapé (Status do Sistema) */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-4"
            } py-3 bg-slate-50 border border-slate-100 rounded-xl cursor-default transition-all duration-300`}
          >
            <div className="relative flex size-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
            </div>
            <div
              className={`flex flex-col overflow-hidden transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
              }`}
            >
              <span className="text-[13px] font-bold text-slate-700 leading-none mb-1">
                Sistema Online
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-none">
                Sincronizado
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
