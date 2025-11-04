/**
 * Configuración simple de rutas protegidas
 * 
 * Para proteger una ruta del dashboard:
 * 1. Si requireAuth = true -> Usuario debe estar logueado
 * 2. Si requireAuth = false -> Ruta pública (cualquiera puede entrar)
 */

export const ROUTE_CONFIG = {
  // Rutas públicas (requireAuth: false)
  public: {
    home: { path: "/", requireAuth: false },
    login: { path: "/login", requireAuth: false },
    histograma: { path: "/histograma", requireAuth: false },
    histogramaLluvia: { path: "/histograma/lluvia", requireAuth: false },
    histogramaNieve: { path: "/histograma/nieve", requireAuth: false },
    histogramaCaudalimetro: { path: "/histograma/caudalimetro", requireAuth: false },
    heatMap: { path: "/components/MapHeatView.tsx", requireAuth: false },
  },
  
  // Rutas protegidas del dashboard (requireAuth: true)
  protected: {
    dashboard: { path: "/dashboard", requireAuth: true },
    estadisticas: { path: "/estadisticas", requireAuth: true },
    reports: { path: "/dashboard/administration/report", requireAuth: true },
    reportEdit: { path: "/dashboard/administration/report/edit", requireAuth: true },
    users: { path: "/dashboard/administration/user", requireAuth: true },
    userAdd: { path: "/dashboard/administration/user/add", requireAuth: true },
    zonaAdd: { path: "/dashboard/Zona/FormAddZona.tsx", requireAuth: true },
    siteAdd: { path: "/dashboard/site/add", requireAuth: true },
    excelImport: { path: "/dashboard/import/excel", requireAuth: true },
  }
};

/**
 * Para cambiar si una ruta requiere login:
 * - Cambia requireAuth: true -> Usuario DEBE estar logueado
 * - Cambia requireAuth: false -> Ruta pública
 * 
 * Ejemplo:
 * Si quieres que /estadisticas requiera login:
 * estadisticas: { path: "/estadisticas", requireAuth: true }
 */
