import React, { useState, useEffect, useMemo, useRef } from "react";
import SidebarPrivate from "@/components/private/SidebarPrivate";
import {
  Menu,
  Edit,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Save,
  X,
  Database,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileUp,
  ChevronDown,
  Check,
} from "lucide-react";

// Mapeamento das tabelas/endpoints da API
const TABELAS = [
  { id: "dengue", nome: "Dengue", endpoint: "/api/dengue/" },
  { id: "tuberculose", nome: "Tuberculose", endpoint: "/api/tuberculose/" },
  { id: "sifilis", nome: "Sífilis", endpoint: "/api/sifilis/" },
  { id: "chagas", nome: "Chagas", endpoint: "/api/chagas/" },
  {
    id: "violenciadomestica",
    nome: "Violência Doméstica",
    endpoint: "/api/violenciadomestica/",
  },
  { id: "hans", nome: "Hanseníase", endpoint: "/api/hans/" },
  { id: "hepatite", nome: "Hepatite", endpoint: "/api/hepatite/" },
  {
    id: "animaispec",
    nome: "Animais Peçonhentos",
    endpoint: "/api/animaispec/",
  },
  { id: "intoxicacao", nome: "Intoxicação", endpoint: "/api/intoxicacao/" },
  { id: "leish", nome: "Leishmaniose", endpoint: "/api/leish/" },
  { id: "aidsadulta", nome: "AIDS Adulta", endpoint: "/api/aidsadulta/" },
];

// Esquema de campos para cada tabela (baseado no models.py)
const TABLE_SCHEMAS = {
  dengue: [
    "numero_notificacao",
    "id_unidade",
    "nome_paciente",
    "endereco",
    "data_notificacao",
    "data_pri_sintoma",
    "data_nascimento",
    "id_agravo",
    "hospital",
    "cs_sexo",
    "classi_fin",
  ],
  tuberculose: ["id_unidade", "nm_ubs", "nu_notific"],
  sifilis: [
    "nu_notific",
    "id_unidade",
    "un_saude",
    "nm_ubs",
    "mu_residen",
    "dt_notific",
    "id_agravo",
    "nm_pacient",
  ],
  chagas: ["id_unidade", "nm_ubs", "nu_notific"],
  violenciadomestica: ["nu_notific", "id_unidade", "nm_ubs"],
  hans: ["id_unidade", "nm_ubs", "nu_notific"],
  hepatite: ["nu_notific", "id_unidade", "nm_ubs"],
  animaispec: ["id_unidade", "nm_ubs", "hospital", "nu_notific"],
  intoxicacao: ["ano_notific", "nu_notific"],
  leish: ["ano_notific", "nu_notific"],
  aidsadulta: ["ano_notific", "nu_notific"],
};

export default function SystemInformation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tabelaAtiva, setTabelaAtiva] = useState(TABELAS[0]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Estados de Importação
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados do Custom Dropdown
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Feedback
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

  // Fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTableDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Carregar dados da tabela selecionada
  const fetchDados = async () => {
    setLoading(true);
    setMensagem({ texto: "", tipo: "" });
    try {
      const response = await fetch(`${baseUrl}${tabelaAtiva.endpoint}`);
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const data = await response.json();
      setDados(data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      mostrarMensagem(
        "Erro ao carregar os dados. Verifique a conexão com o servidor.",
        "erro",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [tabelaAtiva]);

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 5000);
  };

  // Filtragem local
  const dadosFiltrados = useMemo(() => {
    if (!searchTerm) return dados;
    const lowerSearch = searchTerm.toLowerCase();
    return dados.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch),
      ),
    );
  }, [dados, searchTerm]);

  const colunas = TABLE_SCHEMAS[tabelaAtiva.id] || [];

  // Handlers do CRUD
  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingId(item.id);
    } else {
      const initialData = {};
      colunas.forEach((col) => (initialData[col] = ""));
      setFormData(initialData);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId
      ? `${baseUrl}${tabelaAtiva.endpoint}${editingId}/`
      : `${baseUrl}${tabelaAtiva.endpoint}`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Falha ao salvar o registro.");
      mostrarMensagem(
        `Registro ${editingId ? "atualizado" : "criado"} com sucesso!`,
        "sucesso",
      );
      handleCloseModal();
      fetchDados();
    } catch (error) {
      console.error(error);
      mostrarMensagem("Erro ao salvar o registro.", "erro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este registro irreversivelmente?",
      )
    )
      return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}${tabelaAtiva.endpoint}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir.");
      mostrarMensagem("Registro excluído com sucesso!", "sucesso");
      fetchDados();
    } catch (error) {
      console.error(error);
      mostrarMensagem("Erro ao excluir o registro.", "erro");
    } finally {
      setLoading(false);
    }
  };

  // Handler de Importação (DBF / EXCEL)
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("arquivo", uploadFile);
    formDataUpload.append("tabela_destino", tabelaAtiva.id);

    try {
      const response = await fetch(`${baseUrl}/api/upload/`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Falha ao importar o arquivo.");
      mostrarMensagem("Arquivo importado e processado com sucesso!", "sucesso");
      setIsImportModalOpen(false);
      setUploadFile(null);
      fetchDados();
    } catch (error) {
      console.error(error);
      mostrarMensagem(
        "Erro ao importar. Verifique o formato do arquivo (.dbf, .xls, .xlsx).",
        "erro",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      <SidebarPrivate
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full w-full overflow-y-auto ml-0 md:ml-64 relative">
        <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-30 bg-[#4180ab] shadow-sm border-b border-[#043048]/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all"
            >
              <Menu className="size-6" />
            </button>
            <div className="flex items-center gap-2 text-white">
              <Database className="size-5 md:size-6" />
              <h2 className="text-lg md:text-xl font-bold tracking-wide">
                Administração do Sistema
              </h2>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Gerenciador de Tabelas
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Visualize, edite, remova e importe dados brutos SINAN do
                sistema.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Dropdown Customizado Moderno */}
              <div className="relative w-full sm:w-64" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                  className={`flex items-center justify-between w-full bg-white border ${
                    isTableDropdownOpen
                      ? "border-[#4180ab] ring-2 ring-[#4180ab]/20"
                      : "border-slate-300"
                  } text-slate-700 rounded-xl px-4 py-2.5 outline-none font-medium shadow-sm transition-all hover:border-[#4180ab]/50 cursor-pointer`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Database className="w-4 h-4 text-[#4180ab]" />
                    <span className="truncate">Tabela: {tabelaAtiva.nome}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isTableDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isTableDropdownOpen && (
                  <div className="absolute top-full right-0 w-full sm:w-64 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 max-h-72 overflow-y-auto custom-scrollbar">
                    <div className="p-1">
                      {TABELAS.map((tabela) => {
                        const isSelected = tabelaAtiva.id === tabela.id;
                        return (
                          <button
                            key={tabela.id}
                            onClick={() => {
                              setTabelaAtiva(tabela);
                              setIsTableDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2.5 text-sm text-left rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#4180ab]/10 text-[#4180ab] font-bold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span className="truncate">{tabela.nome}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#4180ab]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={fetchDados}
                disabled={loading}
                className="p-2.5 bg-white border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm hover:cursor-pointer disabled:opacity-50"
                title="Atualizar Dados"
              >
                <RefreshCw
                  className={`size-5 ${loading ? "animate-spin text-[#4180ab]" : ""}`}
                />
              </button>
            </div>
          </div>

          {mensagem.texto && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 border ${mensagem.tipo === "sucesso" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {mensagem.tipo === "sucesso" ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
              <span className="font-medium text-sm">{mensagem.texto}</span>
            </div>
          )}

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden h-[calc(100vh-280px)] min-h-[500px]">
            {/* Toolbar Principal */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-slate-50/50">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type="text"
                  placeholder="Buscar nos registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#4180ab] focus:ring-1 focus:ring-[#4180ab] transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm hover:cursor-pointer"
                >
                  <Upload className="size-4" />
                  Importar Arquivo
                </button>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center justify-center gap-2 bg-[#4180ab] hover:bg-[#32678c] text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm hover:cursor-pointer"
                >
                  <Plus className="size-4" />
                  Adicionar Registro
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      ID
                    </th>
                    {colunas.map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && dados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colunas.length + 2}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#4180ab]" />
                        Carregando registros...
                      </td>
                    </tr>
                  ) : dadosFiltrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colunas.length + 2}
                        className="px-6 py-12 text-center text-slate-400 font-medium"
                      >
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  ) : (
                    dadosFiltrados.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                          #{item.id}
                        </td>
                        {colunas.map((col) => (
                          <td
                            key={col}
                            className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate"
                            title={item[col]}
                          >
                            {item[col] || (
                              <span className="text-slate-300 italic">
                                vazio
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium text-center sm:text-left">
              Total de registros: {dadosFiltrados.length}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Upload de Arquivo (DBF / Excel) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileUp className="size-5 text-emerald-600" />
                Importar SINAN
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setUploadFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 text-center">
              <p className="text-sm text-slate-600 mb-6">
                Selecione um arquivo <strong>.dbf</strong>,{" "}
                <strong>.xls</strong> ou <strong>.xlsx</strong> para popular a
                tabela{" "}
                <strong className="text-[#4180ab]">{tabelaAtiva.nome}</strong>.
              </p>

              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500 font-semibold">
                      Clique para selecionar
                    </p>
                    <p className="text-xs text-slate-400">
                      DBF, XLS, XLSX ou CSV
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".dbf, .xls, .xlsx, .csv"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                </label>
              </div>

              {uploadFile && (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100 truncate">
                  Arquivo selecionado: {uploadFile.name}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setUploadFile(null);
                }}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFileUpload}
                disabled={isUploading || !uploadFile}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {isUploading ? "Processando..." : "Iniciar Importação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição de Registos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {editingId ? (
                  <Edit className="size-5 text-[#4180ab]" />
                ) : (
                  <Plus className="size-5 text-[#4180ab]" />
                )}
                {editingId ? "Editar Registro" : "Novo Registro"} -{" "}
                {tabelaAtiva.nome}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form
                id="recordForm"
                onSubmit={handleSave}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {colunas.map((col) => {
                  const label = col.replace(/_/g, " ").toUpperCase();
                  const type =
                    col.includes("data") || col.includes("dt")
                      ? "date"
                      : "text";
                  return (
                    <div key={col} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 tracking-wide">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={col}
                        value={formData[col] || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#4180ab] focus:ring-1 focus:ring-[#4180ab] transition-all"
                        placeholder={`Inserir ${label.toLowerCase()}...`}
                      />
                    </div>
                  );
                })}
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="recordForm"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#4180ab] rounded-lg hover:bg-[#32678c] transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <RefreshCw className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Salvar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `,
        }}
      />
    </div>
  );
}
