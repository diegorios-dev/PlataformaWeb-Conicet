import "leaflet/dist/leaflet.css";
import MapContent from "./components/MapContent";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import ShowReport from "./components/Dashboard/Report/ShowReport";
import ViewManagementUsers from "./components/Dashboard/User/ViewManagementUsers";
import FormEditReport from "./components/Dashboard/Report/FormEditReport";
import FormAddUser from "./components/Dashboard/User/FormAddUser";

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
          <Route path="/dashboard/administration/user/add" element={<FormAddUser/>} />
        </Routes>
      </UserProvider>
    </div>
  );
}