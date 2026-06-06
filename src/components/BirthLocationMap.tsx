/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ComponentType } from "react";
import type { BirthLocation } from "@/lib/astro-types";

// Import Leaflet CSS safely
import "leaflet/dist/leaflet.css";

type BirthLocationMapProps = {
  location?: BirthLocation;
};

interface MapComponents {
  MapContainer: ComponentType<any>;
  TileLayer: ComponentType<any>;
  Marker: ComponentType<any>;
  Popup: ComponentType<any>;
}

export function BirthLocationMap({ location }: BirthLocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const [MapComps, setMapComps] = useState<MapComponents | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      Promise.all([import("react-leaflet"), import("leaflet")])
        .then(([reactLeaflet, L]) => {
          // Fix standard Leaflet icon paths for Webpack/Vite bundlers
          const defaultProto = L.Icon.Default.prototype as unknown as Record<string, unknown>;
          delete defaultProto._getIconUrl;

          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          });

          setMapComps({
            MapContainer: reactLeaflet.MapContainer as unknown as ComponentType<any>,
            TileLayer: reactLeaflet.TileLayer as unknown as ComponentType<any>,
            Marker: reactLeaflet.Marker as unknown as ComponentType<any>,
            Popup: reactLeaflet.Popup as unknown as ComponentType<any>,
          });
        })
        .catch((err) => {
          console.error("Failed to load Leaflet dynamically:", err);
        });
    }
  }, []);

  if (!mounted) {
    return (
      <div className="h-60 w-full rounded-2xl border border-border bg-[oklch(1_0_0/0.02)] flex items-center justify-center text-xs text-muted-foreground">
        Loading map preview...
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-60 w-full rounded-2xl border border-border bg-[oklch(1_0_0/0.02)] flex flex-col items-center justify-center text-center p-4">
        <span className="text-2xl opacity-60 mb-2">🗺️</span>
        <span className="text-xs text-muted-foreground max-w-[200px]">
          No birth location selected. Provide one above to see map preview.
        </span>
      </div>
    );
  }

  if (!MapComps) {
    return (
      <div className="h-60 w-full rounded-2xl border border-border bg-[oklch(1_0_0/0.02)] flex items-center justify-center text-xs text-muted-foreground">
        Initializing map libraries...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComps;
  const position: [number, number] = [location.latitude, location.longitude];

  return (
    <div className="space-y-1.5 animate-reveal-up">
      <div className="h-60 w-full overflow-hidden rounded-2xl border border-border shadow-inner relative z-10">
        <MapContainer center={position} zoom={8} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-xs font-semibold text-gray-900">
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ""}
                {location.country ? `, ${location.country}` : ""}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="text-[10px] text-muted-foreground text-right italic">
        Map centered on {location.name} ({position[0].toFixed(2)}°, {position[1].toFixed(2)}°).
      </div>
    </div>
  );
}
