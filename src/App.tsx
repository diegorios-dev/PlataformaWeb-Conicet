import "leaflet/dist/leaflet.css";
import Home from "./features/home/components/Home";
import { Routes, Route} from "react-router-dom";
import { Login, AuthProvider } from "@features/auth";
import { ReportProvider } from "@context/ReportContext";
import { ErrorBoundary } from "@shared/ui/ErrorBoundary";
import Dashboard from "./features/dashboard/components/Dashboard";
import ShowReport from "./features/report/components/show/ShowReport";
import ViewManagementUsers from "./features/user/components/ViewManagementUsers";
import FormEditReport from "./features/report/components/edit/EditReportForm";
import FormAddUser from "./features/user/components/FormAddUser";
import FormAddZona from "./features/zone/components/FormAddZona";
import ShowHistograma from "./features/histogram/components/ShowHistograma";
import HistogramaLluvia from "./features/histogram/components/HistogramaLluvia";
import HistogramaNieve from "./features/histogram/components/HistogramaNieve";
import HistogramaCaudalimetro from "./features/histogram/components/HistogramaCaudalimetro";
import HeatMapView from "./features/map/components/MapHeatView";
import FormAddSite from "./features/site/components/add/FormAddSite";
import EditSite from "./features/site/components/edit/EditSite";
import { ShowCharts } from "./features/Charts";
import ImportExcel from "./features/excel/components/ImportExcel";
import { ProtectedRoute } from "@features/auth";
import ExportExcel from "./features/excel/components/ExportExcel";
import FormAddRotura from "./features/report/components/add/FormAddRotura";
import FormResolveRotura from "./features/report/components/resolveRotura/FormResolveRotura";
import AdminSitios from "./features/site/components/administration/AdminSitios";

export default function App() {
  return (
    <ErrorBoundary>
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
          <Route path="/mapa-calor" element={<HeatMapView />} />

          {/* Rutas protegidas del dashboard - requieren login */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/estadisticas" element={<ProtectedRoute><ShowCharts /></ProtectedRoute>} />
          
          {/* Gestión de reportes */}
          <Route path="/dashboard/reportes" element={<ProtectedRoute><ShowReport/></ProtectedRoute>} />
          <Route path="/dashboard/reportes/editar" element={<ProtectedRoute><FormEditReport/></ProtectedRoute>} />
          <Route path="/dashboard/reportes/rotura/nuevo" element={<ProtectedRoute><FormAddRotura/></ProtectedRoute>} />
          <Route path="/dashboard/reportes/rotura/resolver" element={<ProtectedRoute><FormResolveRotura/></ProtectedRoute>} />
          
          {/* Gestión de usuarios */}
          <Route path="/dashboard/usuarios" element={<ProtectedRoute><ViewManagementUsers/></ProtectedRoute>} />
          <Route path="/dashboard/usuarios/nuevo" element={<ProtectedRoute><FormAddUser/></ProtectedRoute>} />
          
          {/* Gestión de zonas */}
          <Route path="/dashboard/zonas/nuevo" element={<ProtectedRoute><FormAddZona /></ProtectedRoute>} />
          
          {/* Gestión de sitios */}
          <Route path="/dashboard/sitios" element={<ProtectedRoute><AdminSitios /></ProtectedRoute>} />
          <Route path="/dashboard/sitios/nuevo" element={<ProtectedRoute><FormAddSite /></ProtectedRoute>} />
          <Route path="/dashboard/sitios/editar/:id" element={<ProtectedRoute><EditSite /></ProtectedRoute>} />
          
          {/* Importación/Exportación */}
          <Route path="/dashboard/importar/excel" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />
          <Route path="/dashboard/exportar/excel" element={<ProtectedRoute><ExportExcel /></ProtectedRoute>} />

          </Routes>
        </ReportProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
