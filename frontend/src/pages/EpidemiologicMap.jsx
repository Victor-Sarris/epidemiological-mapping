import { useState, useEffect, useRef } from "react";
import { Map } from "@/components/ui/map";
import { Layers, Sun, Moon } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import Sidebar from "../components/sidebar.jsx";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

function EpidemiologicMap() {
  const mapRef = useRef(null);

  const [activeStyle, setActiveStyle] = useState("light");

  const is3D = activeStyle === "openstreetmap3d";

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }
  }, [is3D]);

  const toggleTheme = () => {
    setActiveStyle((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full relative ml-62.5">
        <header className="px-8 py-5 border-b bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Visão Geoespacial
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Monitoramento ativo de Dengue em Floriano, PI
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 relative">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
            <Map
              ref={mapRef}
              center={[-43.0225, -6.7672]}
              zoom={14}
              styles={{
                light: MAP_STYLES[activeStyle],
                dark: MAP_STYLES[activeStyle],
              }}
            />

            {/* Container unificado (flex gap-3) para os controles ficarem lado a lado */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              {/* Select de Camadas */}
              <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200/60 flex items-center gap-2 transition-all hover:bg-white">
                <div className="pl-2 text-slate-400">
                  <Layers className="size-4" />
                </div>
                <select
                  value={activeStyle}
                  onChange={(e) => setActiveStyle(e.target.value)}
                  className="bg-transparent text-slate-700 rounded-lg pr-8 pl-2 py-2 text-sm focus:outline-none cursor-pointer font-semibold appearance-none"
                >
                  <option value="light">Claro (Carto)</option>
                  <option value="dark">Escuro (Carto)</option>
                  <option value="openstreetmap">OpenStreetMap</option>
                  <option value="openstreetmap3d">Visão 3D</option>
                </select>
              </div>

              {/* Botão de Tema */}
              <button
                onClick={toggleTheme}
                className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200/60 text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center justify-center"
                aria-label="Alternar tema do mapa"
              >
                {activeStyle === "dark" ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EpidemiologicMap;
