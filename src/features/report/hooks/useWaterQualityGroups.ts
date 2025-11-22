import { useEffect, useState } from "react";

export function useWaterQualityGroups(report: any) {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

  const [grupo1Data, setGrupo1Data] = useState({
    ph: "",
    conductividad: "",
    na: "",
  });

  const [grupo2Data, setGrupo2Data] = useState({
    delta_2h: "",
    delta_18o: "",
  });

  const [grupo3Data, setGrupo3Data] = useState({
    nivel_freatico: "",
  });

  useEffect(() => {
    if (!report?.report_regular) return;

    const r = report.report_regular;

    if (r.sample_chemical) {
      setGrupoSeleccionado("grupo1");
      setGrupo1Data({
        ph: r.sample_chemical.ph?.toString() || "",
        conductividad: r.sample_chemical.conductivity?.toString() || "",
        na: r.sample_chemical.Na?.toString() || "",
      });
    }

    else if (r.sample_isotopo) {
      setGrupoSeleccionado("grupo2");
      setGrupo2Data({
        delta_2h:
          (r.sample_isotopo["δ2H"] || r.sample_isotopo["δ2H"])?.toString() ||
          "",
        delta_18o: r.sample_isotopo["18O"]?.toString() || "",
      });
    }

    else if (r.sample_level) {
      setGrupoSeleccionado("grupo3");
      setGrupo3Data({
        nivel_freatico: r.sample_level.freaticLevel?.toString() || "",
      });
    }
  }, [report]);

  const buildWaterQuality = () => {
    if (grupoSeleccionado === "grupo1") {
      const wq: any = {};
      if (grupo1Data.ph) wq.ph = parseFloat(grupo1Data.ph);
      if (grupo1Data.conductividad) wq.conductividad = parseFloat(grupo1Data.conductividad);
      if (grupo1Data.na) wq.na_mg_l = parseFloat(grupo1Data.na);
      return wq;
    }

    if (grupoSeleccionado === "grupo2") {
      const wq: any = {};
      if (grupo2Data.delta_2h) wq.delta_2h = parseFloat(grupo2Data.delta_2h);
      if (grupo2Data.delta_18o) wq.o_180 = parseFloat(grupo2Data.delta_18o);
      return wq;
    }

    if (grupoSeleccionado === "grupo3") {
      const wq: any = {};
      if (grupo3Data.nivel_freatico)
        wq.nivel_freatico = parseFloat(grupo3Data.nivel_freatico);
      return wq;
    }

    return {};
  };

  return {
    grupoSeleccionado,
    setGrupoSeleccionado,
    grupo1Data,
    setGrupo1Data,
    grupo2Data,
    setGrupo2Data,
    grupo3Data,
    setGrupo3Data,
    buildWaterQuality,
  };
}
