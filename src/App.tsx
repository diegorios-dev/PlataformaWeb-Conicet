import "leaflet/dist/leaflet.css";
import Home from "./features/home/components/Home";
import { Routes, Route} from "react-router-dom";
import Login from "./features/Login/components/Login";
import { AuthProvider } from "@context/AuthContext";
import { ReportProvider } from "@context/ReportContext";
import Dashboard from "./features/dashboard/components/Dashboard";
import ShowReport from "./features/report/components/show/ShowReport";
import ViewManagementUsers from "./features/user/components/ViewManagementUsers";
import FormEditReport from "./features/report/components/edit/FormEditReport";
import FormAddUser from "./features/user/components/FormAddUser";
import FormAddZona from "./features/zona/components/FormAddZona";
import ShowHistograma from "./features/histograma/components/ShowHistograma";
import HistogramaLluvia from "./features/histograma/components/HistogramaLluvia";
import HistogramaNieve from "./features/histograma/components/HistogramaNieve";
import HistogramaCaudalimetro from "./features/histograma/components/HistogramaCaudalimetro";
import HeatMapView from "./features/map/components/MapHeatView";
import FormAddSite from "./features/site/components/add/FormAddSite";
import { ShowCharts } from "./features/Charts";
import ImportExcel from "./features/excel/components/ImportExcel";
import ProtectedRoute from "./features/PrivatedRoute/ProtectedRoute";
import ExportExcel from "./features/excel/components/ExportExcel";
import FormAddRotura from "./features/report/components/add/FormAddRotura";
import FormResolveRotura from "./features/report/components/resolveRotura/FormResolveRotura";
import AdminSitios from "./features/site/components/administration/AdminSitios";

export default function App() {
  return (
    <div>
      <AuthProvider>
        <ReportProvider>
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
          <Route path="/dashboard/administration/report/rotura/add" element={<ProtectedRoute><FormAddRotura/></ProtectedRoute>} />
          <Route path="/dashboard/administration/report/rotura/resolve" element={<ProtectedRoute><FormResolveRotura/></ProtectedRoute>} />
          <Route path="/dashboard/administration/user" element={<ProtectedRoute><ViewManagementUsers/></ProtectedRoute>} />
          <Route path="/dashboard/administration/user/add" element={<ProtectedRoute><FormAddUser/></ProtectedRoute>} />
          <Route path="/dashboard/Zona/FormAddZona.tsx" element={<ProtectedRoute><FormAddZona /></ProtectedRoute>} />
          <Route path="/dashboard/site/add" element={<ProtectedRoute><FormAddSite /></ProtectedRoute>} />
          <Route path="/dashboard/import/excel" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />
          <Route path="/dashboard/export/excel" element={<ProtectedRoute><ExportExcel /></ProtectedRoute>} />
          <Route path="/dashboard/site" element={<ProtectedRoute><AdminSitios /></ProtectedRoute>} />

          </Routes>
        </ReportProvider>
      </AuthProvider>
    </div>
  );
}