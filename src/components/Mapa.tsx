"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const defaultIcon = typeof window !== "undefined" ? L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}) : undefined;

type Ponto = {
  id: number;
  latitude: number;
  longitude: number;
};

type Props = {
  pontos: Ponto[];
  onAddPoint: (lat: number, lng: number) => void;
};

function ClickHandler({ onAddPoint }: { onAddPoint: Props["onAddPoint"] }) {
  useMapEvents({
    click(e) {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Mapa({ pontos, onAddPoint }: Props) {
  return (
    <div className="h-full w-full min-h-[500px]">
      <MapContainer
        center={[-23.5, -46.6]}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        <ClickHandler onAddPoint={onAddPoint} />

        {pontos.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={defaultIcon}
          />
        ))}
      </MapContainer>
    </div>
  );
}