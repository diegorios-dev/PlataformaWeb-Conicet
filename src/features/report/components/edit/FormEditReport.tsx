import { useState } from "react";
import { updateReporte } from "@services/reportService";
import { useReportSelection } from "@context/ReportContext";
import useNavegation from "@hooks/useNavegation";

import { useSitiosYzonas } from "../../hooks/useSitiosYzonas";
import { useWaterQualityGroups } from "../../hooks/useWaterQualityGroups";

import { HeaderEdit } from "./HeaderEdit";
import { ReportInfoCard } from "./ReportInfoCard";
import { Alerts } from "./Alerts";
import { PrecipitacionForm } from "./PrecipitacionForm";
import { CalidadAguaForm } from "./CalidadAguaForm";
import ResumenParametros from "./ResumenParametros";
import { ButtonLoading } from "@shared/ui/atoms/Button";

const FormEditReport = () => {

  const { report } = useReportSelection();
  const { go } = useNavegation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const isPrecipitacionLluvia = report.site?.event_id === 1;

  const {sitios,sitioSeleccionado,zonaSeleccionada,seleccionarSitio} = useSitiosYzonas(report.site?.id);

  const {grupoSeleccionado,setGrupoSeleccionado,grupo1Data,setGrupo1Data,grupo2Data,setGrupo2Data,grupo3Data,setGrupo3Data,buildWaterQuality} = useWaterQualityGroups(report);

  const [formData, setFormData] = useState({
    note: report.note || "",
    amount: report.report_regular?.amount || "",
    site_id: report.site?.id || "",
    zona_id: report.site?.zona_id || "",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "site_id") {
      const id = parseInt(value);
      seleccionarSitio(id);

      const sitio = sitios.find(s => s.id === id);

      setFormData(prev => ({
        ...prev,
        site_id: value,
        zona_id: sitio?.zona_id ?? "",
      }));

      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const waterQuality = buildWaterQuality();

      const payload: any = {
        note: formData.note,
        site_id: Number(formData.site_id),
        zona_id: Number(formData.zona_id),
      };

      if (report.report_regular) {
        payload.report_regular = {
          amount: Number(formData.amount),
        };
      }

      if (Object.keys(waterQuality).length > 0) {
        payload.water_quality = waterQuality;
      }

      await updateReporte(report.id, payload);

      setSuccess(true);
      setTimeout(() => {
        go.reports.list();
      }, 1200);

    } catch {
      setError("Error al actualizar el reporte");
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <HeaderEdit />

      <div className="flex items-center justify-center p-6 md:p-8">

        <div className="w-full max-w-7xl">
          
          {/* Info Card del reporte - full width */}
          <ReportInfoCard report={report} isPrecipitacionLluvia={isPrecipitacionLluvia} />

          {/* Mensajes de éxito/error - full width */}
          <Alerts success={success} error={error} />
    
          {/* columna de a 2 */}
          <div className="grid gap-6">
            
            <div className="flex flex-col gap-6">

              <PrecipitacionForm
                report={report}
                formData={formData}
                handleChange={handleChange}
                sitios={sitios}
                zonaSeleccionada={zonaSeleccionada}
                sitioSeleccionado={sitioSeleccionado}
              />

              {/* FORMULARIO DERECHO - Calidad del Agua */}
              <CalidadAguaForm 
                grupoSeleccionado={grupoSeleccionado}
                setGrupoSeleccionado={setGrupoSeleccionado}
                grupo1Data={grupo1Data}
                setGrupo1Data={setGrupo1Data}
                grupo2Data={grupo2Data}
                setGrupo2Data={setGrupo2Data}
                grupo3Data={grupo3Data}
                setGrupo3Data={setGrupo3Data}
              />

              {/* Resumen de Parámetros Ingresados */}
              <ResumenParametros
                grupoSeleccionado={grupoSeleccionado}
                grupo1Data={grupo1Data}
                grupo2Data={grupo2Data}
                grupo3Data={grupo3Data}
              />


            </div>

            <ButtonLoading 
              onSubmit={handleSubmit} 
              onCancel={go.reports.list} 
              loading={loading} 
              success={success}
            />
            
          </div>
        </div>


      
      </div>
  </div>
  );
};

export default FormEditReport;


