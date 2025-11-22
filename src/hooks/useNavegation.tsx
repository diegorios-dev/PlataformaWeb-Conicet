import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const useNavigation = () => {
  const navigate = useNavigate();
  const { handleSelectReport } = useUserContext();

  // ➤ Helper simple
  const go = (path: string) => navigate(path);

  return {
    go: {
      home: () => go("/"),
      login: () => go("/login"),

      dashboard: () => go("/dashboard"),

      sites: {
        list: () => go("/dashboard/site"),
        add: () => go("/dashboard/site/add"),
      },

      zonas: {
        list: () => go("/dashboard/Zona/FormAddZona.tsx"),
      },

      reports: {

        list: () => go("/dashboard/administration/report"),
        addRotura: () => go("/dashboard/administration/report/rotura/add"),
        resolveRotura: () => go("/dashboard/administration/report/rotura/resolve"),
        edit: (report: any) => {
          handleSelectReport(report);
          go("/dashboard/administration/report/edit");
        }
        
      },

      users: {
        list: () => go("/dashboard/administration/user"),
        add: () => go("/dashboard/administration/user/add"),
      },

      excel: {
        export: () => go("/dashboard/export/excel"),
        import: () => go("/dashboard/import/excel"),
      },

      histograma: {
        list: () => go("/histograma"),
        lluvia: () => go("/histograma/lluvia"),
        nieve: () => go("/histograma/nieve"),
        caudalimetro: () => go("/histograma/caudalimetro"),
      },

      stats: () => go("/estadisticas"),

      heatmap: () => go("/components/MapHeatView.tsx"),


      back: () => {
        const current = window.location.pathname;

        if (current.includes("/dashboard/administration/report/edit"))
          return go("/dashboard/administration/report");

        if (current.includes("/dashboard/administration/user/add"))
          return go("/dashboard/administration/user");

        if (current.includes("/dashboard/administration"))
          return go("/dashboard");

        if (current.includes("/estadisticas"))
          return go("/dashboard");

        if (current.includes("/dashboard/site/add"))
          return go("/dashboard");

        if (current.includes("/dashboard/Zona"))
          return go("/dashboard");

        if (current.includes("/dashboard/import/excel"))
          return go("/dashboard");

        if (current.includes("/dashboard/export/excel"))
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
  };
};

export default useNavigation;
