import React, { useState } from "react";
// 1. Importamos o useLocation e o Link do react-router-dom
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Map,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [isEndemiasOpen, setIsEndemiasOpen] = useState(false);

  // 2. Pegamos a rota atual da URL
  const location = useLocation();

  // 3. Função auxiliar para checar se a rota está ativa
  const isActive = (path) => {
    // Se for a Home, a rota tem que ser exatamente "/"
    if (path === "/") {
      return location.pathname === "/";
    }
    // Para as outras, checamos se a URL começa com aquele caminho
    // (assim o mapa de dengue também deixa o "Mapa Epidemiológico" ativo)
    return location.pathname.startsWith(path);
  };

  // 4. Classes padrão para evitar repetição
  const baseClasses =
    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-[#054060] text-white"; // Estilo quando está selecionado
  const inactiveClasses =
    "text-gray-700 hover:bg-gray-100 hover:text-[#054060]"; // Estilo inativo

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
      {/* Cabeçalho da Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 text-xl font-bold text-gray-800">
        Logo do Projeto
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        <Link
          to="/"
          className={`${baseClasses} ${isActive("/") ? activeClasses : inactiveClasses}`}
        >
          <Home className="mr-3 h-5 w-5" />
          Home
        </Link>

        <Link
          to="/dados-gerais"
          className={`${baseClasses} ${isActive("/dados-gerais") ? activeClasses : inactiveClasses}`}
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Link>

        <Link
          to="/mapa-epidemiologico"
          className={`${baseClasses} ${isActive("/mapa-epidemiologico") ? activeClasses : inactiveClasses}`}
        >
          <Map className="mr-3 h-5 w-5" />
          Mapa Epidemiológico
        </Link>

        <hr className="my-2 border-gray-200" />
      </nav>
      <p className="text-gray-500 text-center">
        &copy; Secretaria de Saúde 2026
      </p>
    </aside>
  );
};

export default Sidebar;
