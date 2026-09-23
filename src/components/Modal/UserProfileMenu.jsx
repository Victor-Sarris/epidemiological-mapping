import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fecha o menu se o utilizador clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a página de login após sair
  };

  // Define o nome a exibir (com fallback de segurança)
  const displayName = user?.first_name || user?.username || "Administrador";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Cabeçalho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-colors ${
          isOpen ? "bg-white/20" : "hover:bg-white/10"
        }`}
      >
        <UserCircle className="size-7 text-white" />
        <span className="text-sm font-medium hidden sm:block capitalize text-white">
          {displayName}
        </span>
        <ChevronDown
          className={`size-4 text-white/70 transition-transform duration-200 hidden sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-0.5">
            <p className="text-sm font-bold text-slate-800 capitalize truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              @{user?.username || "admin"}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>

          {/* Opções do Menu */}
          <div className="p-2">
            <hr className="my-1 border-slate-100" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="size-4" />
              Terminar Sessão
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
