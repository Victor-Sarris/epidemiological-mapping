import { useState, useEffect, useRef } from "react";
import { Map } from "@/components/ui/map";

const styles = {
  default: undefined,
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="p-6 text-center border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Visão Geoespacial - Floriano, PI
        </h1>
      </header>

      <main className="flex-1 p-6 flex flex-col">
        <div className="relative flex-1 w-full min-h-[600px] rounded-xl overflow-hidden border shadow-sm bg-white">
          <Map
            ref={mapRef}
            center={[-43.0225, -6.7672]} // Coordenadas de Floriano, PI
            zoom={14}
            styles={
              selectedStyle
                ? { light: selectedStyle, dark: selectedStyle }
                : undefined
            }
          />

          {/* Controle flutuante para trocar o estilo do mapa */}
          <div className="absolute top-4 right-4 z-10">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="bg-white text-gray-800 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer font-medium"
            >
              <option value="default">Padrão (Carto)</option>
              <option value="openstreetmap">OpenStreetMap</option>
              <option value="openstreetmap3d">OpenStreetMap 3D</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EpidemiologicMap;
