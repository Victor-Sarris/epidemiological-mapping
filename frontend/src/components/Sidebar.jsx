import React, { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Map,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  // Estado para controlar se o menu de endemias está aberto ou fechado
  const [isEndemiasOpen, setIsEndemiasOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
      {/* Cabeçalho da Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 text-xl font-bold text-gray-800">
        Logo do Projeto
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        <a
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
        >
          <Home className="mr-3 h-5 w-5" />
          Home
        </a>
        <a
          href="/dados-gerais"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </a>
        <a
          href="/mapa-epidemiologico"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
        >
          <Map className="mr-3 h-5 w-5" />
          Mapa Epidemiológico
        </a>

        <hr className="my-2 border-gray-200" />
      </nav>
    </aside>
  );
};

export default Sidebar;
