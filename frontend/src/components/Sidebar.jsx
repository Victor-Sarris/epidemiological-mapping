import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Resource-Flow.png";

import {
  IoArrowBackSharp,
  IoHomeOutline,
  IoCalendarOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoMenu,
} from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          className="fixed top-6 left-6 z-40 p-3 glass text-fg rounded-xl shadow-lg hover:bg-elevated transition-all border border-line cursor-pointer"
        >
          <IoMenu size={24} />
        </button>
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full w-64 glass-strong text-fg
          rounded-r-3xl flex flex-col shadow-2xl z-50 border-r border-line
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex flex-col gap-5">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-elevated hover:opacity-80 transition-opacity text-muted cursor-pointer"
          >
            <IoArrowBackSharp size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Resource Flow"
              className="h-11 w-11 object-contain drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]"
            />
            <div>
              <h3 className="text-xl font-bold text-gradient">Resource Flow</h3>
              <p className="text-xs text-muted">Gerenciamento de Eventos</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-line mx-6 mb-2" />

        <nav className="flex-1 px-4 flex flex-col gap-2">
          <MenuButton
            icon={<IoHomeOutline size={20} />}
            text="Home"
            onClick={() => handleNavigation("/dashboard")}
            active={location.pathname === "/dashboard"}
          />
          <MenuButton
            icon={<IoCalendarOutline size={20} />}
            text="Agenda"
            onClick={() => handleNavigation("/diary")}
            active={location.pathname === "/diary"}
          />
          <MenuButton
            icon={<IoHelpCircleOutline size={20} />}
            text="Suporte"
            onClick={() => handleNavigation("/support")}
            active={location.pathname === "/support"}
          />
          <MenuButton
            icon={<CgProfile size={20} />}
            text="Perfil"
            onClick={() => handleNavigation("/profile")}
            active={location.pathname === "/profile"}
          />
        </nav>

        <div className="p-4 mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 group cursor-pointer"
          >
            <IoLogOutOutline
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        />
      )}
    </>
  );
}

function MenuButton({ icon, text, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
        ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 text-white"
            : "text-muted hover:bg-elevated hover:text-fg"
        }
      `}
    >
      {icon}
      <span className="font-medium text-sm tracking-wide">{text}</span>
    </button>
  );
}

export default Sidebar;
