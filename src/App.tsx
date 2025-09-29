import "leaflet/dist/leaflet.css";
import MapContent from "./components/MapContent";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import ShowReport from "./components/Dashboard/ShowReport";
import ViewManagementUsers from "./components/Dashboard/ViewManagementUsers";
import FormEditReport from "./components/Dashboard/FormEditReport";

export default function App() {

  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<MapContent />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard/administration/report" element={<ShowReport/>} />
          <Route path="/dashboard/administration/report/edit" element={<FormEditReport/>} />
          <Route path="/dashboard/administration/user" element={<ViewManagementUsers/>} />
        </Routes>
      </UserProvider>
    </div>
  );
}