import { useState, useEffect, useRef } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Layers, Sun, Moon, AlertTriangle, Activity } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import Sidebar from "../components/sidebar.jsx";
import EndemiaFilter from "../components/EndemiasFilter.jsx";
import ButtonTheme from "../components/ButtonTheme.jsx";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

const locations = [
  {
    id: 1,
    name: "Foco Confirmado - Alto da Cruz",
    type: "Dengue",
    status: "CRÍTICO",
    lng: -43.0184,
    lat: -6.7643,
  },
  {
    id: 2,
    name: "Suspeita - Centro",
    type: "Zika",
    status: "ALERTA",
    lng: -43.024017,
    lat: -6.768912,
  },
  {
    id: 3,
    name: "Foco Confirmado - Viazul",
    type: "Chikungunya",
    status: "CRÍTICO",
    lng: -43.016,
    lat: -6.7675,
  },
];

function EpidemiologicMap() {
  const mapRef = useRef(null);

  // Estados do Mapa
  const [activeStyle, setActiveStyle] = useState("light");

  // NOVO: Estado para controlar o filtro de endemias
  const [endemiaSelecionada, setEndemiaSelecionada] = useState("gerais");

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

      <div className="flex-1 flex flex-col h-full relative ml-64">
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
            >
              {locations.map((location) => (
                <MapMarker
                  key={location.id}
                  longitude={location.lng}
                  latitude={location.lat}
                >
                  <MarkerContent>
                    <div
                      className={`size-3.5 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 ${
                        location.status === "CRÍTICO"
                          ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                          : "bg-amber-500"
                      }`}
                    />
                  </MarkerContent>

                  <MarkerTooltip className="font-semibold text-xs rounded-md px-2 py-1">
                    {location.name}
                  </MarkerTooltip>

                  <MarkerPopup className="shadow-2xl rounded-2xl overflow-hidden p-0 border-0">
                    <div className="p-4 w-64 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        {location.status === "CRÍTICO" ? (
                          <AlertTriangle className="size-4 text-rose-500" />
                        ) : (
                          <Activity className="size-4 text-amber-500" />
                        )}
                        <h3 className="font-bold text-slate-800 text-sm">
                          {location.name}
                        </h3>
                      </div>

                      <div className="space-y-1 mb-4">
                        <p className="text-xs text-slate-500 font-medium">
                          Vetor:{" "}
                          <span className="text-slate-700">
                            {location.type}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Status:{" "}
                          <span
                            className={
                              location.status === "CRÍTICO"
                                ? "text-rose-600 font-bold"
                                : "text-amber-600 font-bold"
                            }
                          >
                            {location.status}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Coordenadas: {location.lat.toFixed(4)},{" "}
                          {location.lng.toFixed(4)}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium"
                      >
                        Ver Prontuário / Ação
                      </Button>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>

            <ButtonTheme
              activeStyle={activeStyle}
              setActiveStyle={setActiveStyle}
              toggleTheme={toggleTheme}
            />

            <EndemiaFilter
              selected={endemiaSelecionada}
              onChange={setEndemiaSelecionada}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default EpidemiologicMap;
