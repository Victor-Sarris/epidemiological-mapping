import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import {
  IoChatbubbles,
  IoEllipse,
  IoClose,
  IoWarning,
  IoSend,
  IoHardwareChip,
} from "react-icons/io5";
import { Menu } from "lucide-react";

function Support() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o seu assistente virtual. Como posso ajudar você hoje?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userText = inputValue;

    // Adiciona a mensagem do usuário
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");
    setIsLoading(true); // Ativa o estado de carregamento

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || "";
      const apiUrl = rawApiUrl.replace(/\/+$/, "");

      const response = await fetch(`${apiUrl}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.response },
        ]);
      } else {
        throw new Error("Erro na resposta da API");
      }
    } catch (error) {
      console.error("Erro de comunicação com o chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Desculpe, ocorreu um erro de conexão com o servidor. Tente novamente mais tarde.",
        },
      ]);
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden text-slate-800">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto ml-0 md:ml-64 relative">
        <header className="md:hidden px-4 py-4 flex items-center justify-between sticky top-0 z-30 bg-gradient-to-r from-[#054060] to-indigo-700 shadow-lg border-b border-[#043048]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all"
            >
              <Menu className="size-6" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Suporte
            </h2>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-[#054060] via-blue-900 to-indigo-800 text-white py-12 md:py-16 px-6 lg:px-12 relative overflow-hidden rounded-3xl shadow-xl border border-white/10">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-8 md:gap-12">
              <div className="lg:w-2/3 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm">
                  Como podemos ajudar?
                </h1>
                <p className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Obtenha suporte instantâneo para suas necessidades na
                  plataforma Resource Flow com nossa inteligência artificial.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center justify-center gap-3 shadow-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-semibold text-sm md:text-base tracking-wide">
                      Suporte 24/7 Ativo
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 flex items-center justify-center gap-3 shadow-sm">
                    <IoChatbubbles className="text-blue-300 text-lg" />
                    <span className="font-semibold text-sm md:text-base tracking-wide">
                      Respostas em tempo real
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 flex justify-center hidden md:flex">
                <div
                  className="relative w-56 h-56 flex items-center justify-center group cursor-pointer"
                  onClick={toggleChatbot}
                >
                  <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                  <div className="absolute inset-6 bg-white/10 rounded-full group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute inset-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl group-hover:bg-white/30 transition-colors duration-500">
                    <IoChatbubbles className="text-white text-6xl drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Banner de Aviso */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 md:p-6 flex flex-col gap-2 rounded-xl shadow-sm">
            <h2 className="flex items-center gap-2 text-lg text-amber-700 font-bold">
              <IoWarning size={24} className="shrink-0" /> Aviso Importante
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base pl-8">
              As respostas do chat automatizado são geradas por uma Inteligência
              Artificial focada no contexto geral da plataforma. Para demandas
              complexas ou específicas, nossa equipe humana está pronta para
              ajudar pelo email:{" "}
              <a
                href="mailto:vigilanciafloriano@gmail.com"
                className="text-amber-700 hover:text-amber-800 font-bold underline underline-offset-2 break-all transition-colors"
              >
                vigilanciafloriano@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Botão flutuante do Chatbot */}
        {!isChatbotOpen && (
          <button
            onClick={toggleChatbot}
            aria-label="Abrir suporte por chat"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-gradient-to-r from-[#054060] to-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.4)] transform hover:-translate-y-1 transition-all duration-300 z-50 group"
          >
            <IoChatbubbles className="text-3xl group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </button>
        )}

        {/* Janela do Chatbot Modal */}
        {isChatbotOpen && (
          <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full h-full md:h-[600px] md:w-[400px] bg-white md:rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            {/* Header do Chat */}
            <div className="bg-gradient-to-r from-[#054060] to-indigo-700 p-4 md:p-5 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <IoHardwareChip className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-none">
                    Assistente Virtual
                  </h3>
                  <span className="text-indigo-200 text-xs font-medium flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>{" "}
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors cursor-pointer"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 p-4 md:p-5 flex flex-col gap-4 overflow-y-auto bg-slate-50/50 scroll-smooth">
              <div className="text-center mb-2">
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">
                  Hoje
                </span>
              </div>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3.5 text-sm md:text-base max-w-[85%] shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#054060] text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Indicador de Digitação (Carregamento) */}
              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              )}

              {/* Div invisível para ancorar o scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Área de Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escreva sua mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="w-full bg-slate-50 text-slate-800 pl-5 pr-14 py-3.5 rounded-full border border-slate-200 focus:outline-none focus:border-[#054060] focus:ring-2 focus:ring-[#054060]/20 transition-all text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === "" || isLoading}
                  className="absolute right-1.5 p-2.5 bg-[#054060] text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
                >
                  <IoSend size={18} className="translate-x-0.5" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400">
                  A IA pode cometer erros. Verifique informações importantes.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Support;
