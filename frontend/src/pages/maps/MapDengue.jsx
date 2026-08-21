import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { Map, MapGeoJSON } from "@/components/ui/map";
import { Activity, Map as MapIcon } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import EndemiasFilter from "@/components/EndemiasFilter";
import ButtonTheme from "@/components/ButtonTheme";
import MapLegend from "@/components/MapLegend"; // <- Adicione esta linha!

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

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

  // Estados para gerenciar a lista completa e a seleção atual
  const [todosPacientes, setTodosPacientes] = useState([]);
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

  // 1. EFEITO DE CARREGAMENTO (Executa apenas 1 vez quando a tela abre)
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/pacientes/")
      .then((res) => res.json())
      .then((data) => {
        setTodosPacientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar mapa:", err);
        setLoading(false);
      });
  }, []);

  // 2. EFEITO DE FILTRAGEM (Executa sempre que a 'endemiaSelecionada' muda)
  useEffect(() => {
    if (todosPacientes.length === 0) return;

    // Filtra os pacientes baseados no código CID-10 (id_agravo)
    const pacientesFiltrados = todosPacientes.filter((p) => {
      const agravo = p.id_agravo ? p.id_agravo.toUpperCase() : "";

      if (endemiaSelecionada === "dengue") {
        return agravo.includes("A90") || agravo === ""; // Considerando vazios como dengue devido à base inicial
      }
      if (endemiaSelecionada === "sifilis") {
        return (
          agravo.includes("A51") ||
          agravo.includes("A52") ||
          agravo.includes("A53")
        );
      }
      if (endemiaSelecionada === "tuberculose") {
        return agravo.includes("A15") || agravo.includes("A16");
      }
      if (endemiaSelecionada === "gerais") {
        return true; // Retorna todos os casos
      }

      return true;
    });

    // Contagem de casos por bairro
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

    // Atualiza as cores dos polígonos
    const updatedFeatures = bairrosFlorianoGeoJSON.features.map((feature) => {
      const nomeBairro = feature.properties.name;
      const totalCasos = contagemPorBairro[nomeBairro] || 0;

      let corPoligono = "#3b82f6"; // Azul (Nenhum caso)
      if (totalCasos > 15)
        corPoligono = "#e11d48"; // Vermelho (Crítico)
      else if (totalCasos > 5)
        corPoligono = "#f59e0b"; // Laranja (Alerta)
      else if (totalCasos > 0) corPoligono = "#eab308"; // Amarelo (Atenção)

      return {
        ...feature,
        properties: {
          ...feature.properties,
          total: totalCasos,
          color: corPoligono,
        },
      };
    });

    setGeoData({ ...bairrosFlorianoGeoJSON, features: updatedFeatures });
  }, [endemiaSelecionada, todosPacientes]);

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
            {/* COMPONENTE DE FILTRO (Agora interativo!) */}
            <EndemiasFilter
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
                styles={{
                  light: MAP_STYLES[activeStyle] || MAP_STYLES.light,
                  dark: MAP_STYLES[activeStyle] || MAP_STYLES.dark,
                }}
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

            {/* COMPONENTE DE LEGENDA */}
            <MapLegend />

            {/* COMPONENTE DE TEMA */}
            <ButtonTheme
              activeStyle={activeStyle}
              setActiveStyle={setActiveStyle}
              toggleTheme={toggleTheme}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
