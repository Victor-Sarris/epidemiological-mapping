import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SidebarPrivate from "@/components/private/SidebarPrivate.jsx";
import {
  Code,
  Cpu,
  Bot,
  Printer,
  GraduationCap,
  Menu,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function AboutDeveloper({ isPrivateView = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      {isPrivateView ? (
        <SidebarPrivate
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto overflow-x-hidden ml-0 md:ml-[var(--sidebar-width,16rem)] transition-all duration-300">
        <header className="px-4 md:px-8 py-3 md:py-4 flex items-center gap-3 sticky top-0 z-30 bg-gradient-to-br from-[#4180ab] to-[#054060] text-white shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all"
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold tracking-wide">
            Sobre o Desenvolvedor
          </h1>
        </header>

        <div className="p-3 sm:p-4 md:p-8 max-w-5xl mx-auto w-full space-y-5 md:space-y-8 pb-20">
          {/* Card de Perfil */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4180ab] to-[#054060]" />

            <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-8 items-center sm:items-start">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-slate-100 border-4 border-white shadow-md rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden mt-2">
                <img
                  src="https://portifoliopro-victorsarris.netlify.app/img/eu.png"
                  alt="Foto de Victor Sarrís"
                  className="w-full h-full object-cover text-slate-400"
                />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight break-words">
                  Victor Sarrís Silva Santos
                </h2>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-slate-600 font-medium text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <GraduationCap
                      size={14}
                      className="text-[#4180ab] shrink-0"
                    />
                    <span className="text-left">
                      Tec. em Análise e Desenv. de Sistemas
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                    <MapPin size={14} className="text-[#4180ab] shrink-0" />
                    IFPI Campus Floriano
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Desenvolvedor de software apaixonado por tecnologia,
                    inovação e resolução de problemas. Com sólida base acadêmica
                    e prática, focado na criação de sistemas que impactam
                    positivamente a sociedade e a área da saúde.
                  </p>
                  <a
                    href="https://portifoliopro-victorsarris.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#4180ab] hover:text-[#32678c] font-semibold text-sm md:text-base transition-colors"
                  >
                    Visitar portfólio
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stack & Interesses */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2 mb-4 md:mb-6">
              <Bot className="text-[#4180ab] size-5 md:size-6" />
              Stack & Interesses
            </h3>

            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h4 className="font-semibold text-slate-700 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                  <Code size={16} className="text-[#4180ab]" />
                  Desenvolvimento de Software
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Python", "Django Rest Framework", "Ionic", "ReactJS"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-[#4180ab]/10 text-[#054060] text-xs font-bold rounded-lg border border-[#4180ab]/20"
                      >
                        {tech}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                  <Cpu size={16} className="text-[#4180ab]" />
                  Tecnologias Emergentes
                </h4>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
                    <Bot size={14} className="shrink-0 text-[#4180ab]" />
                    Integração e Serviços de Inteligência Artificial
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
                    <Cpu size={14} className="shrink-0 text-[#4180ab]" />
                    Internet das Coisas (IoT)
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
                    <Printer size={14} className="shrink-0 text-[#4180ab]" />
                    Modelagem CAD e Impressão 3D
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
