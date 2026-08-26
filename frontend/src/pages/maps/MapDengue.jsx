import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import EndemiasFilter from "../../components/EndemiasFilter.jsx";
import ButtonTheme from "../../components/ButtonTheme.jsx";
import {
  Map,
  MapGeoJSON,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "../../components/ui/map.jsx";
import {
  Activity,
  Map as MapIcon,
  Star,
  Navigation,
  Clock,
  ExternalLink,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";

// importação de imagens para o maps ----------
import postodeSaudeTaboca from "../../assets/ubs/PostodeSaúdedaTaboca.jpg";
import JasminaBucar from "../../assets/ubs/jasminabucar.jpg";
import VianaCarvalho from "../../assets/ubs/vianacarvalho.jpg";
import santaCruz from "../../assets/ubs/santacruz.png";
import ubsFloriano from "../../assets/ubs/ubsfloriano.jpg";
import dirceuArcoverde from "../../assets/ubs/dirceuarcoverde.png";
import joseParaguassu from "../../assets/ubs/joseparaguassu.jpg";
import theodoroSobral from "../../assets/ubs/theodoroSobral.jpg";
import pedroSimplicio from "../../assets/ubs/pedroSimplicio.jpg";
import alfedroCarvalho from "../../assets/ubs/alfredoCarvalho.jpg";
import defaultImage from "../../assets/ubs/defaultImage.png";
import RaimundoFilho from "../../assets/ubs/ubsRaimundoFilho.png";

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
      properties: { name: "SAO CRISTOVAO", total: 34, color: "#3b82f6" },
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
      properties: { name: "MANGUINHA", total: 5, color: "#3b82f6" },
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
      properties: { name: "MELADAO", total: 10, color: "#3b82f6" },
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

const marcadores = [
  {
    id: "ubsfloriano",
    name: "UBS Floriano",
    label: "UBS Floriano",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: ubsFloriano,
    lng: -43.02682240512934,
    lat: -6.770093782739466,
  },
  {
    id: "dirceuarcoverde",
    name: "UBS - Dirceu Arcoverde",
    label: "UBS Dirceu Arcoverde",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: dirceuArcoverde,
    lng: -43.035177909954896,
    lat: -6.765799779484518,
  },
  {
    id: "joseparaguassu",
    name: "UBS - José Paraguassú",
    label: "UBS - José Paraguassú",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: joseParaguassu,
    lng: -43.00770775101921,
    lat: -6.773752245581162,
  },
  {
    id: "santacruz",
    name: "UBS - Santa Cruz",
    label: "UBS - Santa Cruz",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: santaCruz,
    lng: -43.00218329805059,
    lat: -6.761697944954173,
  },
  {
    id: "teodorosobral",
    name: "UBS - Theodoro Sobral",
    label: "UBS - Theodoro Sobral",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: theodoroSobral,
    lng: -43.020540939559325,
    lat: -6.778873054851179,
  },
  {
    id: "pedrosimplicio",
    name: "UBS Pedro Simplicio",
    label: "UBS Pedro Simplicio",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: pedroSimplicio,
    lng: -43.03129938856098,
    lat: -6.780671072283543,
  },
  {
    id: "alfedrocarvalho",
    name: "UBS - Alfredo de Carvalho",
    label: "UBS - Alfredo de Carvalho",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: alfedroCarvalho,
    lng: -43.03492649035711,
    lat: -6.787711988762435,
  },
  {
    id: "helvidioholanda",
    name: "UBS Helvidio de Holanda Barros",
    label: "UBS Helvidio de Holanda Barros",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: defaultImage,
    lng: -43.02848164082034,
    lat: -6.786913028924275,
  },
  {
    id: "paulomartins",
    name: "UBS Paulo Martins",
    label: "UBS Paulo Martins",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: defaultImage,
    lng: -43.018652030194644,
    lat: -6.78669340844439,
  },
  {
    id: "raimundofilho",
    name: "UBS Raimundo Filho",
    label: "UBS Raimundo Filho",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: RaimundoFilho,
    lng: -43.012394698425496,
    lat: -6.776288849546959,
  },
  // verificar se esse realmente existe ⬇️
  {
    id: "jasminabucar",
    name: "Clínica Integrada e UBS Jasmina Bucar",
    label: "Clínica Integrada e UBS Jasmina Bucar",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: JasminaBucar,
    lng: -43.040365240768104,
    lat: -6.7808203604476915,
  },
  {
    id: "postosaudetaboca",
    name: "Posto de Saúde da Taboca",
    label: "Posto de Saúde da Taboca",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: postodeSaudeTaboca,
    lng: -43.042174574073606,
    lat: -6.770507792362777,
  },
  {
    id: "vianacarvalho",
    name: "Posto de Saúde Viana de Carvalho",
    label: "Posto de Saúde Viana de Carvalho",
    category: "UBS",
    rating: 4,
    reviews: 2,
    hours: "07:00 AM - 5:00 PM",
    color: "#8b5cf6",
    image: VianaCarvalho,
    lng: -43.01058274720951,
    lat: -6.764758882936275,
  },
];

export default function MapDengue() {
  const mapRef = useRef(null);
  const [activeStyle, setActiveStyle] = useState("light");
  const [geoData, setGeoData] = useState(bairrosFlorianoGeoJSON);
  const [loading, setLoading] = useState(true);

  const [todosPacientes, setTodosPacientes] = useState([]);
  const [endemiaSelecionada, setEndemiaSelecionada] = useState("dengue");

  const is3D = activeStyle === "openstreetmap3d";
  const navigate = useNavigate();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }
  }, [is3D]);

  const toggleTheme = () => {
    setActiveStyle((prev) => (prev === "dark" ? "light" : "dark"));
  };

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

  useEffect(() => {
    if (todosPacientes.length === 0) return;

    const pacientesFiltrados = todosPacientes.filter((p) => {
      const agravo = p.id_agravo ? p.id_agravo.toUpperCase() : "";

      if (endemiaSelecionada === "dengue") {
        return agravo.includes("A90") || agravo === "";
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
        return true;
      }

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

    const updatedFeatures = bairrosFlorianoGeoJSON.features.map((feature) => {
      const nomeBairro = feature.properties.name;
      const totalCasos = contagemPorBairro[nomeBairro] || 0;

      let corPoligono = "#3b82f6";
      if (totalCasos > 15) corPoligono = "#e11d48";
      else if (totalCasos > 5) corPoligono = "#f59e0b";
      else if (totalCasos > 0) corPoligono = "#2A7293";

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
        <header className="px-8 py-5 border-b bg-[#054060] backdrop-blur-md z-10 flex items-center justify-betweend">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <MapIcon className="text-white-600 size-6" />
              Mapa Epidemiológico Setorial
            </h1>
            <p className="text-sm text-white font-medium mt-0.5">
              Densidade de Casos por Bairro - Floriano, PI
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 relative">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
            <EndemiasFilter
              selected={endemiaSelecionada}
              onChange={setEndemiaSelecionada}
            />

            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Activity className="size-8 text-blue-500 animate-spin" />
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

                {marcadores.map((place) => (
                  <MapMarker
                    key={place.id}
                    longitude={place.lng}
                    latitude={place.lat}
                  >
                    <MarkerContent>
                      <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-rose-500 shadow-lg transition-transform hover:scale-110" />
                      <MarkerLabel position="bottom">{place.label}</MarkerLabel>
                    </MarkerContent>
                    <MarkerPopup className="w-62 p-0">
                      <div className="relative h-32 overflow-hidden rounded-t-md">
                        {/* AQUI FOI FEITA A ALTERAÇÃO: Tag img padrão ao invés de Image do Next */}
                        <img
                          src={place.image}
                          alt={place.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="space-y-2 p-3">
                        <div>
                          <p className="text-muted-foreground pb-0.5 text-[11px] font-medium tracking-wide uppercase">
                            {place.category}
                          </p>
                          <h3 className="text-foreground leading-tight font-semibold">
                            {place.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{place.rating}</span>
                            <span className="text-muted-foreground">
                              ({place.reviews.toLocaleString()})
                            </span>
                          </div>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <Clock className="size-3.5" />
                          <span>{place.hours}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" className="flex-1">
                            <Navigation className="size-3.5" />
                            Directions
                          </Button>
                          <Button size="icon-sm" variant="outline">
                            <ExternalLink className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                ))}
              </Map>
            )}

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
