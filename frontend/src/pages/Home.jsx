import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Star, Navigation, Clock, ExternalLink } from "lucide-react";

const places = [
  {
    id: 1,
    name: "Cais da Beira Rio",
    label: "Ponto Turístico",
    category: "Lazer",
    rating: 4.8,
    reviews: 1453,
    hours: "Aberto 24 horas",
    image:
      "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=300&h=200&fit=crop",
    lng: -43.0184,
    lat: -6.7643,
  },
  {
    id: 2,
    name: "Mercado Central",
    label: "Comércio",
    category: "Mercado",
    rating: 4.5,
    reviews: 834,
    hours: "06:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=300&h=200&fit=crop",
    lng: -43.016,
    lat: -6.7675,
  },
  {
    id: 3,
    name: "Praça Dr. Sebastião Martins",
    label: "Praça",
    category: "Público",
    rating: 4.7,
    reviews: 521,
    hours: "Aberto 24 horas",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=200&fit=crop",
    lng: -43.0205,
    lat: -6.7681,
  },
];

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-6 text-center border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          Mapa Epidemiológico - Floriano, PI
        </h1>
      </header>

      <main className="flex-1 p-6">
        <div className="h-150 w-full rounded-xl overflow-hidden border shadow-sm">
          {/* Centralizado em Floriano, PI com zoom ajustado */}
          <Map center={[-43.0225, -6.7672]} zoom={14}>
            {places.map((place) => (
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
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
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
                        <Navigation className="size-3.5 mr-2" />
                        Rotas
                      </Button>
                      <Button size="icon" variant="outline" className="w-9 h-9">
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}
          </Map>
        </div>
      </main>
    </div>
  );
}

export default Home;
