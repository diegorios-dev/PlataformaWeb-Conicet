import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import Map from "../src/components/map";

export default function App() {
  const position: LatLngExpression = [-34.6037, -58.3816];

  return (
    <div>
      <div>
        <p className="text-9xl">holaaa</p>
      </div>
      <div>
        <Map position={position}/>
      </div>

    </div>
  );
}