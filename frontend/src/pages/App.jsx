import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import Dashboard from "./DashBoard.jsx";
import EpidemiologicMap from "./EpidemiologicMap.jsx";
import MapDengue from "./maps/MapDengue.jsx";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dados-gerais" element={<Dashboard />} />
          <Route path="/mapa-epidemiologico" element={<EpidemiologicMap />} />
          <Route path="/endemias/dengue" element={<MapDengue />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
