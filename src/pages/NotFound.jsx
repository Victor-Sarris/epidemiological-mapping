import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import ParticlesBg from "particles-bg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800">
      <ParticlesBg type="circle" bg={true} />

      <div className="relative z-10 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-lg w-full animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="size-12 text-rose-500" />
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight mb-2">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-4">
          Página não encontrada
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mb-8 leading-relaxed">
          A rota que você tentou acessar não existe, foi movida ou você não tem
          permissão para visualizá-la.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors hover:cursor-pointer"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-[#054060] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#085883] transition-colors focus:ring-4 focus:ring-[#054060]/20 hover:cursor-pointer"
          >
            <Home className="size-5" />
            Página Inicial
          </button>
        </div>
      </div>
    </div>
  );
}
