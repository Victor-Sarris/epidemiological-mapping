import React, { useState, useRef, useEffect } from "react";
import {
  UserCircle,
  LogOut,
  ChevronDown,
  User,
  Settings,
  Mail,
  Shield,
} from "lucide-react";
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
    // Fecha o menu se apertar ESC
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

  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a página de login após sair
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  // Define o nome a exibir (com fallback de segurança)
  const displayName = user?.first_name || user?.username || "Visitante";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Cabeçalho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all duration-200 border active:scale-95 ${
          isOpen
            ? "bg-white/20 border-white/30"
            : "border-transparent hover:bg-white/10"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
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
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Cabeçalho do Dropdown (Informações do Usuário) */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100 flex flex-col items-center text-center">
            {/* Avatar Maior */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 border-4 border-white shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="size-10 text-blue-600" />
              )}
            </div>

            <p className="text-base font-bold text-slate-800 capitalize truncate w-full">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate w-full mb-2">
              @{user?.username || "visitante"}
            </p>

            {/* Informações Adicionais (E-mail e Cargo) */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              {user?.email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate max-w-full">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}

              {user?.role && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 mt-1 rounded-full bg-blue-100 text-blue-700 w-max">
                  <Shield className="size-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            {/* Status Online */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>

          {/* Opções do Menu */}
          <div className="p-2 space-y-1">
            {/* <button
              onClick={() => handleNavigate("/profile")}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left"
            >
              <User className="size-4" />
              Meu Perfil
            </button>

            <button
              onClick={() => handleNavigate("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left"
            >
              <Settings className="size-4" />
              Configurações
            </button> */}

            <hr className="my-1 border-slate-100" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
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
