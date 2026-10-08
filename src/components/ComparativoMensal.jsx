import React, { useMemo } from "react";
import { ArrowUp, ArrowDown, Minus, TrendingUp } from "lucide-react";

export default function ComparativoMensal({
  pacientes = [],
  escopo = "unidade",
}) {
  const dados = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

    let casosMesAtual = 0;
    let casosMesAnterior = 0;

    pacientes.forEach((p) => {
      const dt = p.data_notificacao || p.dt_notific;
      if (!dt) return;
      const data = new Date(dt);
      if (isNaN(data)) return;

      const m = data.getMonth();
      const a = data.getFullYear();

      if (m === mesAtual && a === anoAtual) casosMesAtual++;
      else if (m === mesAnterior && a === anoAnterior) casosMesAnterior++;
    });

    let variacao = 0;
    if (casosMesAnterior > 0) {
      variacao = ((casosMesAtual - casosMesAnterior) / casosMesAnterior) * 100;
    } else if (casosMesAtual > 0) {
      variacao = 100;
    }

    const nomeMesAtual = new Date(anoAtual, mesAtual, 1).toLocaleString(
      "pt-BR",
      { month: "long" },
    );
    const nomeMesAnterior = new Date(
      anoAnterior,
      mesAnterior,
      1,
    ).toLocaleString("pt-BR", { month: "long" });

    return {
      casosMesAtual,
      casosMesAnterior,
      variacao: Math.round(variacao * 10) / 10,
      nomeMesAtual:
        nomeMesAtual.charAt(0).toUpperCase() + nomeMesAtual.slice(1),
      nomeMesAnterior:
        nomeMesAnterior.charAt(0).toUpperCase() + nomeMesAnterior.slice(1),
    };
  }, [pacientes]);

  const {
    casosMesAtual,
    casosMesAnterior,
    variacao,
    nomeMesAtual,
    nomeMesAnterior,
  } = dados;

  const subtitulo =
    escopo === "unidade"
      ? "Mês atual vs. mês anterior na sua unidade"
      : "Mês atual vs. mês anterior no município";

  let corVariacao = "text-slate-500";
  let bgVariacao = "bg-slate-50 border-slate-200";
  let IconeVariacao = Minus;
  if (variacao > 0) {
    corVariacao = "text-rose-600";
    bgVariacao = "bg-rose-50 border-rose-200";
    IconeVariacao = ArrowUp;
  } else if (variacao < 0) {
    corVariacao = "text-emerald-600";
    bgVariacao = "bg-emerald-50 border-emerald-200";
    IconeVariacao = ArrowDown;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="size-5 text-[#4180ab]" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Comparativo Mensal
          </h3>
          <p className="text-sm text-slate-500">{subtitulo}</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 items-center">
        <div className="text-center">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            {nomeMesAnterior}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-slate-700">
            {casosMesAnterior}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">casos</p>
        </div>

        <div className="text-center border-l border-slate-100">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            {nomeMesAtual}
          </p>
          <p className="text-3xl sm:text-4xl font-black text-[#054060]">
            {casosMesAtual}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">casos</p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bgVariacao} ${corVariacao}`}
        >
          <IconeVariacao className="size-4" />
          <span className="text-sm font-bold">
            {variacao > 0 ? "+" : ""}
            {variacao}%
          </span>
          <span className="text-xs font-medium opacity-75">
            {variacao > 0 ? "aumento" : variacao < 0 ? "redução" : "estável"}
          </span>
        </div>
      </div>
    </div>
  );
}
