import "leaflet/dist/leaflet.css";
import MapContent from "./components/MapContent";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard";

export default function App() {

  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<MapContent />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </UserProvider>
    </div>
  );
}