import React from "react";
import { ShieldCheck, Database, Lock, UserCheck, X } from "lucide-react";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#054060] text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6" />
            <h2 className="text-xl font-bold tracking-wide">
              Política de Privacidade
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar text-slate-600 leading-relaxed text-sm sm:text-base space-y-8">
          <p className="text-slate-500 font-medium">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Database className="size-5 text-[#054060]" />
              1. Coleta e Uso de Dados
            </h3>
            <p>
              O sistema <strong>EPI-DATA</strong>, gerido pela Secretaria de
              Saúde de Floriano/PI, coleta e processa dados epidemiológicos
              estritamente para fins de monitoramento, formulação de políticas
              públicas e controle de endemias. Os dados inseridos no sistema são
              oriundos de sistemas oficiais (como o SINAN) e são utilizados de
              forma anonimizada e agregada na visão pública.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Lock className="size-5 text-[#054060]" />
              2. Proteção e Segurança
            </h3>
            <p>
              Implementamos medidas de segurança técnicas e administrativas
              rigorosas para proteger os dados contra acessos não autorizados,
              perdas ou alterações. O acesso aos dados sensíveis e relatórios
              detalhados é restrito unicamente a profissionais de saúde e
              gestores autorizados mediante autenticação segura.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <UserCheck className="size-5 text-[#054060]" />
              3. Compartilhamento de Informações
            </h3>
            <p>
              Não comercializamos, alugamos ou compartilhamos dados sensíveis de
              pacientes com terceiros. O compartilhamento de estatísticas e
              mapas de calor em áreas de acesso público é feito de maneira
              genérica e georreferenciada (por quadrantes ou bairros),
              garantindo a impossibilidade de identificação individual.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              4. Direitos e Conformidade
            </h3>
            <p>
              Este sistema atua em conformidade com a Lei Geral de Proteção de
              Dados (LGPD - Lei nº 13.709/2018), garantindo o respeito à
              privacidade dos cidadãos. O tratamento dos dados tem como base
              legal a execução de políticas públicas e a proteção da vida e da
              saúde.
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              5. Contato DPO (Encarregado de Dados)
            </h3>
            <p className="text-sm">
              Para dúvidas relativas ao tratamento de dados ou relatos de
              incidentes, entre em contato:
              <br />
              <a
                href="mailto:vigilanciafloriano@gmail.com"
                className="text-[#054060] font-bold hover:underline mt-2 inline-block"
              >
                vigilanciafloriano@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-5 border-t border-slate-100 flex justify-end bg-slate-50/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#054060] rounded-xl hover:bg-[#085883] transition-colors focus:ring-4 focus:ring-[#054060]/20 hover:cursor-pointer"
          >
            Compreendi e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
