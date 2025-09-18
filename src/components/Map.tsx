import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  const reglas: MarkerData[] = [
    { position: [-41.32, -69.51], label: "Regla 1" },
    { position: [-41.29, -69.53], label: "Regla 2" },
  ];

  const caudalimetros: MarkerData[] = [
    { position: [-41.28, -69.5], label: "Caudalímetro 1" },
  ];

  let markers: MarkerData[] = [];

  switch (instrument) {
    case "pluviometro":
      markers = pluviometros;
      break;
    case "regla":
      markers = reglas;
      break;
    case "caudalimetro":
      markers = caudalimetros;
      break;
    default:
      markers = [];
  }

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
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;