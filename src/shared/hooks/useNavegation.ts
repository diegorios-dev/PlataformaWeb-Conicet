import { useNavigate } from "react-router-dom";
import { useReportSelection } from "@context/ReportContext";
import type { Report } from "@features/report/types";
import { useMemo, useCallback } from "react";

const useNavigation = () => {
  const navigate = useNavigate();
  const { handleSelectReport } = useReportSelection();

  // ➤ Helper simple
  const go = useCallback((path: string) => navigate(path), [navigate]);

  // ➤ OPTIMIZACIÓN: Memoizar el objeto go para evitar re-renders de componentes hijos
  return useMemo(() => ({
    go: {
      home: () => go("/"),
      login: () => go("/login"),

      dashboard: () => go("/dashboard"),

      sites: {
        list: () => go("/dashboard/sitios"),
        add: () => go("/dashboard/sitios/nuevo"),
        edit: (id: number) => go(`/dashboard/sitios/editar/${id}`),
      },

      zonas: {
        add: () => go("/dashboard/zonas/nuevo"),
      },

      reports: {
        list: () => go("/dashboard/reportes"),
        addRotura: () => go("/dashboard/reportes/rotura/nuevo"),
        resolveRotura: () => go("/dashboard/reportes/rotura/resolver"),
        edit: (report: Report) => {
          handleSelectReport(report);
          go("/dashboard/reportes/editar");
        }
      },

      users: {
        list: () => go("/dashboard/usuarios"),
        add: () => go("/dashboard/usuarios/nuevo"),
      },

      excel: {
        export: () => go("/dashboard/exportar/excel"),
        import: () => go("/dashboard/importar/excel"),
      },

      histograma: {
        list: () => go("/histograma"),
        lluvia: () => go("/histograma/lluvia"),
        nieve: () => go("/histograma/nieve"),
        caudalimetro: () => go("/histograma/caudalimetro"),
      },

      stats: () => go("/estadisticas"),

      heatmap: () => go("/mapa-calor"),

      map : () => go("/"),


      back: () => {
        const current = window.location.pathname;

        if (current.includes("/dashboard/reportes/editar"))
          return go("/dashboard/reportes");

        if (current.includes("/dashboard/reportes/rotura"))
          return go("/dashboard/reportes");

        if (current.includes("/dashboard/usuarios/nuevo"))
          return go("/dashboard/usuarios");

        if (current.includes("/estadisticas"))
          return go("/dashboard");

        if (current.includes("/dashboard/sitios/editar"))
          return go("/dashboard/sitios");

        if (current.includes("/dashboard/sitios/nuevo"))
          return go("/dashboard/sitios");

        if (current.includes("/dashboard/zonas/nuevo"))
          return go("/dashboard");

        if (current.includes("/dashboard/importar/excel"))
          return go("/dashboard");

        if (current.includes("/dashboard/exportar/excel"))
          return go("/dashboard");

        if (current.includes("/dashboard"))
          return go("/");

        if (current.includes("/histograma") || current.includes("/MapHeatView"))
          return go("/");

        if (current.includes("/login"))
          return go("/");

        return go("/");
      }
    }
  }), [go, handleSelectReport]); // ➤ Dependencias: go y handleSelectReport
};

export default useNavigation;


