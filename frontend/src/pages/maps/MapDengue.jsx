import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import EndemiaFilter from "../../components/EndemiasFilter.jsx";
import { Map, MapGeoJSON } from "@/components/ui/map";
import { Activity, Map as MapIcon } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

// Base GeoJSON (Mantida igual)
const bairrosFlorianoGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "CENTRO", total: 0, color: "#3b82f6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.028, -6.762],
            [-43.018, -6.762],
            [-43.018, -6.772],
            [-43.028, -6.772],
            [-43.028, -6.762],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "SAO CRISTOVAO", total: 0, color: "#3b82f6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.038, -6.765],
            [-43.028, -6.765],
            [-43.028, -6.775],
            [-43.038, -6.775],
            [-43.038, -6.765],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "MANGUINHA", total: 0, color: "#3b82f6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.018, -6.758],
            [-43.008, -6.758],
            [-43.008, -6.765],
            [-43.018, -6.765],
            [-43.018, -6.758],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "MELADAO", total: 0, color: "#3b82f6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.025, -6.772],
            [-43.015, -6.772],
            [-43.015, -6.78],
            [-43.025, -6.78],
            [-43.025, -6.772],
          ],
        ],
      },
    },
  ],
};

export default function MapDengue() {
  const mapRef = useRef(null);
  const [activeStyle, setActiveStyle] = useState("light");
  const [geoData, setGeoData] = useState(bairrosFlorianoGeoJSON);
  const [loading, setLoading] = useState(true);

  // Novo estado para controlar qual endemia está selecionada
  const [endemiaSelecionada, setEndemiaSelecionada] = useState("dengue");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/pacientes/")
      .then((res) => res.json())
      .then((pacientes) => {
        // Exemplo prático de como o filtro que criamos vai atuar nos dados:
        const pacientesFiltrados = pacientes.filter((p) => {
          // 'A90' é o ID_AGRAVO de Dengue no SINAN
          if (endemiaSelecionada === "dengue")
            return p.id_agravo === "A90" || p.id_agravo === null;
          // Adicione a lógica para sífilis, tuberculose, etc, depois
          return true;
        });

        const contagemPorBairro = {};

        pacientesFiltrados.forEach((paciente) => {
          if (paciente.endereco) {
            const partes = paciente.endereco.split(",");
            const bairroStr = partes[partes.length - 1].trim().toUpperCase();
            const bairroNormalizado = bairroStr
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            contagemPorBairro[bairroNormalizado] =
              (contagemPorBairro[bairroNormalizado] || 0) + 1;
          }
        });

        const updatedFeatures = bairrosFlorianoGeoJSON.features.map(
          (feature) => {
            const nomeBairro = feature.properties.name;
            const totalCasos = contagemPorBairro[nomeBairro] || 0;

            let corPoligono = "#3b82f6";
            if (totalCasos > 15) corPoligono = "#e11d48";
            else if (totalCasos > 5) corPoligono = "#f59e0b";
            else if (totalCasos > 0) corPoligono = "#eab308";

            return {
              ...feature,
              properties: {
                ...feature.properties,
                total: totalCasos,
                color: corPoligono,
              },
            };
          },
        );

        setGeoData({ ...bairrosFlorianoGeoJSON, features: updatedFeatures });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar mapa:", err);
        setLoading(false);
      });
  }, [endemiaSelecionada]); // <- O Hook agora recarrega a contagem do mapa sempre que você troca a endemia!

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative ml-64">
        <header className="px-8 py-5 border-b bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <MapIcon className="text-rose-600 size-6" />
              Mapa Epidemiológico Setorial
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Densidade de Casos por Bairro - Floriano, PI
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 relative">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
            {/* INJEÇÃO DO NOVO COMPONENTE DE FILTRO */}
            <EndemiaFilter
              selected={endemiaSelecionada}
              onChange={setEndemiaSelecionada}
            />

            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Activity className="size-8 text-rose-500 animate-spin" />
              </div>
            ) : (
              <Map
                ref={mapRef}
                center={[-43.0225, -6.7672]}
                zoom={13.5}
                styles={{ light: MAP_STYLES.light, dark: MAP_STYLES.dark }}
              >
                <MapGeoJSON
                  data={geoData}
                  fillPaint={{
                    "fill-color": ["get", "color"],
                    "fill-opacity": 0.4,
                  }}
                  linePaint={{
                    "line-color": ["get", "color"],
                    "line-width": 2,
                  }}
                />
              </Map>
            )}

            {/* INJEÇÃO DO NOVO COMPONENTE DE LEGENDA */}
            <MapLegend />

            <div className="absolute top-4 right-4 z-10">
              <select
                value={activeStyle}
                onChange={(e) => setActiveStyle(e.target.value)}
                className="bg-white/90 backdrop-blur-md text-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none shadow-lg border border-slate-200/60 cursor-pointer font-semibold"
              >
                <option value="light">Mapa Claro</option>
                <option value="dark">Mapa Escuro</option>
              </select>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
