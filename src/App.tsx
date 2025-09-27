import "leaflet/dist/leaflet.css";
import MapContent from "./components/MapContent";
import { Routes, Route} from "react-router-dom";

export default function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<MapContent />} />
      </Routes>
    </div>
  );
}