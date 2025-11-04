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
import ShowHistograma from "./components/histograma/ShowHistograma";
import HistogramaLluvia from "./components/histograma/HistogramaLluvia";
import HistogramaNieve from "./components/histograma/HistogramaNieve";
import HistogramaCaudalimetro from "./components/histograma/HistogramaCaudalimetro";
import HeatMapView from "./components/MapHeatView";
import FormAddSite from "./components/Dashboard/site/FormAddSite";
import ShowCharts from "./components/Dashboard/Charts/ShowCharts";
import ImportExcel from "./components/Dashboard/excel/ImportExcel";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/histograma" element={<ShowHistograma />} />
          <Route path="/histograma/lluvia" element={<HistogramaLluvia />} />
          <Route path="/histograma/nieve" element={<HistogramaNieve />} />
          <Route path="/histograma/caudalimetro" element={<HistogramaCaudalimetro />} />
          <Route path="/components/MapHeatView.tsx" element={<HeatMapView />} />

          {/* Rutas protegidas del dashboard - requieren login */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/estadisticas" element={<ProtectedRoute><ShowCharts /></ProtectedRoute>} />
          <Route path="/dashboard/administration/report" element={<ProtectedRoute><ShowReport/></ProtectedRoute>} />
          <Route path="/dashboard/administration/report/edit" element={<ProtectedRoute><FormEditReport/></ProtectedRoute>} />
          <Route path="/dashboard/administration/user" element={<ProtectedRoute><ViewManagementUsers/></ProtectedRoute>} />
          <Route path="/dashboard/administration/user/add" element={<ProtectedRoute><FormAddUser/></ProtectedRoute>} />
          <Route path="/dashboard/Zona/FormAddZona.tsx" element={<ProtectedRoute><FormAddZona /></ProtectedRoute>} />
          <Route path="/dashboard/site/add" element={<ProtectedRoute><FormAddSite /></ProtectedRoute>} />
          <Route path="/dashboard/import/excel" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />

        </Routes>
      </UserProvider>
    </div>
  );
}