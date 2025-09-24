import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Instrument = "pluviometro" | "regla" | "caudalimetro";

// Define el tipo para los marcadores
interface MarkerData {
  position: [number, number]; // Tupla explícita
  label: string;
}

interface MapProps {
  instrument: Instrument;
}

const Map = ({ instrument }: MapProps) => {
  // Especifica el tipo MarkerData[] en cada arreglo
  const pluviometros: MarkerData[] = [
    { position: [-41.3, -69.5], label: "Pluviómetro 1" },
    { position: [-41.31, -69.52], label: "Pluviómetro 2" },
  ];

  return (
    <MapContainer
      center={[-41.3, -69.5]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((m, i) => (
        <Marker key={i} position={m.position}>
          <Tooltip  permanent>{m.label}</Tooltip >
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;