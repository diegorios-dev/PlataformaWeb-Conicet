import "leaflet/dist/leaflet.css";
import Home from "./components/Home";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import ShowReport from "./components/Dashboard/Report/ShowReport";
import ViewManagementUsers from "./components/Dashboard/User/ViewManagementUsers";
import FormEditReport from "./components/Dashboard/Report/FormEditReport";
import FormAddUser from "./components/Dashboard/User/FormAddUser";
import FormAddZona from "./components/Dashboard/Zona/FormAddZona";

export default function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard/administration/report" element={<ShowReport/>} />
          <Route path="/dashboard/administration/report/edit" element={<FormEditReport/>} />
          <Route path="/dashboard/administration/user" element={<ViewManagementUsers/>} />
          <Route path="/dashboard/administration/user/add" element={<FormAddUser/>} />
          <Route path="/components/Dashboard/Zona/FormAddZona.tsx" element={<FormAddZona />} />
        </Routes>
      </UserProvider>
    </div>
  );
}