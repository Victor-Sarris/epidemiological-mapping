import { useState, useEffect, useRef } from "react";
import { Map } from "@/components/ui/map";
import { Layers } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import Sidebar from "../components/sidebar.jsx"; // Mantive sua importação da sidebar

const styles = {
  default: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

function EpidemiologicMap() {
  const mapRef = useRef(null);
  const [style, setStyle] = useState("default");
  const selectedStyle = styles[style];
  const is3D = style === "openstreetmap3d";

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }
  }, [is3D]);

  return (
    // Estrutura flex-row para a Sidebar ficar na lateral esquerda
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo Principal à direita */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header clean e integrado */}
        <header className="px-8 py-5 border-b bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Visão Geoespacial
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Monitoramento ativo de Floriano, PI
            </p>
          </div>
        </header>

        {/* Container do Mapa ocupando o resto da altura */}
        <main className="flex-1 p-4 md:p-6 relative">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <Map
              ref={mapRef}
              center={[-43.0225, -6.7672]}
              zoom={14}
              mapStyle={selectedStyle}
            />

            {/* Controle de Camadas flutuante e moderno */}
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200/60 flex items-center gap-2 transition-all hover:bg-white">
              <div className="pl-2 text-slate-400">
                <Layers className="size-4" />
              </div>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-transparent text-slate-700 rounded-lg pr-8 pl-2 py-2 text-sm focus:outline-none cursor-pointer font-semibold appearance-none"
              >
                <option value="default">Padrão (OpenFreeMap)</option>
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="openstreetmap3d">Visão 3D</option>
              </select>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EpidemiologicMap;
