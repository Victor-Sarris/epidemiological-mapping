import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import EpidemiologicMap from "./EpidemiologicMap.jsx";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa-epidemiologico" element={<EpidemiologicMap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
