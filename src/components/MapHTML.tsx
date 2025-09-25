import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo : string
}

interface MapHTMLProps {
  position: Coord[];
}

const MapHTML = ({ position }: MapHTMLProps) => {

  if (!position || position.length === 0) {
    return <p>No hay posiciones para mostrar</p>;
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <MapContainer key={JSON.stringify(center)} center={center} zoom={6} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {position.map((coords, index) => (
        <Marker key={index} position={coords.coordenadas}>
          <Popup>
            📍 Cantidad {coords.cantidad} : {coords.tipo} 
          </Popup>
        </Marker>
      ))}
      
    </MapContainer>
  );

};


export default MapHTML;
