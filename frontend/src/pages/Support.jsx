import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { IoChatbubbles, IoEllipse, IoClose, IoWarning } from "react-icons/io5";

function Support() {
  // 1. Estado para controlar o chat
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // 2. Função para alternar o chat
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="flex min-h-screen app-aurora">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 transition-all duration-300 ml-62.5">
        {/* Hero com fundo colorido fixo — texto permanece branco nos dois temas */}
        <section className="bg-linear-to-r from-blue-900 to-purple-700 text-white py-16 sm:py-20 px-6 lg:px-10 relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-500 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-10">
            <div className="lg:w-2/3 text-center lg:text-left animate-fade-in-up">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Como podemos ajudá-lo hoje?
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto lg:mx-0">
                Obtenha suporte instantâneo para suas necessidades na plataforma
                Resource Flow.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 hover-lift cursor-default">
                  <IoEllipse className="text-green-400 text-xs" />
                  <span className="font-medium">Suporte 24/7 Disponível</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 hover-lift cursor-default">
                  <IoEllipse className="text-green-400 text-xs" />
                  <span className="font-medium">Tempo Médio: 5min</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white/5 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-8 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <IoChatbubbles className="text-white text-7xl drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card de aviso */}
        <div className="glass w-full text-fg border border-amber-500/30 p-6 flex flex-col gap-3 rounded-3xl mt-6 shadow-2xl">
          <h2 className="flex items-center gap-2 text-xl text-amber-500 font-bold">
            <IoWarning size={24} /> Atenção
          </h2>
          <p className="text-muted leading-relaxed">
            Todas as respostas são dadas por uma IA especializada no contexto
            geral da plataforma. Caso queira uma resposta mais específica, entre
            em contato com:{" "}
            <a
              href="mailto:devvictorsarris@gmail.com"
              className="text-blue-500 hover:text-blue-400 hover:underline font-medium"
            >
              devvictorsarris@gmail.com
            </a>
          </p>
        </div>

        {!isChatbotOpen && (
          <button
            onClick={toggleChatbot}
            aria-label="Abrir suporte por chat"
            className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 z-50 group"
          >
            <IoChatbubbles className="text-2xl group-hover:rotate-12 transition-transform" />
            <div className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></div>
          </button>
        )}

        {isChatbotOpen && (
          <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-surface border border-line rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up">
            {/* Header do Chat (gradiente fixo) */}
            <div className="bg-[#054060] p-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <IoChatbubbles /> Suporte Automatizado
              </h3>
              <button
                onClick={toggleChatbot}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="h-64 p-4 bg-surface text-muted text-sm flex flex-col gap-3 overflow-y-auto">
              <div className="self-start bg-elevated p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                Olá! Sou o assistente virtual. Como posso ajudar você hoje?
              </div>
            </div>
            <div className="p-3 bg-field border-t border-line">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="w-full bg-surface text-fg px-4 py-2 rounded-full border border-line focus:outline-none focus:border-purple-500 text-sm placeholder-faint"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Support;
