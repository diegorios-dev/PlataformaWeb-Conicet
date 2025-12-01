

interface HeatmapTooltipProps {
  nombre: string;
  valor: number;
  unidad: string;
  fecha: string;
  lat?: number;
  lng?: number;
}

export const createHeatmapTooltipContent = (props: HeatmapTooltipProps): string => {
  const { nombre, valor, unidad, fecha, lat, lng } = props;
  
  // Formatear fecha como en PopupSite
  const formattedDate = new Date(fecha).toLocaleDateString('es-AR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const reportYear = new Date(fecha).getFullYear();
  
  // Determinar el icono según el tipo de evento (MapPin para ubicación)
  const getEventIcon = () => {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>`;
  };

  return `
    <div style="
      font-family: 'Poppins', sans-serif;
      padding: 12px;
      min-width: 260px;
      background: white;
      border-radius: 12px;
    ">
      <!-- Header del popup -->
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e2e8f0;
      ">
        <div style="
          background: #dbeafe;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
        ">
          ${getEventIcon()}
        </div>
        <div style="flex: 1;">
          <span style="
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            display: block;
          ">${nombre}</span>
          ${lat && lng ? `<span style="
            font-size: 12px;
            color: #64748b;
            font-family: monospace;
          ">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>` : ''}
        </div>
      </div>

      <!-- Total acumulado (igual a la medición en heatmap) -->
      <div style="
        background: #dbeafe;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
          <span style="
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Total Acumulado</span>
        </div>
        <span style="
          font-size: 24px;
          font-weight: 700;
          color: #1d4ed8;
          display: block;
        ">${valor.toFixed(2)} <span style="font-size: 14px; font-weight: 500;">${unidad}</span></span>
      </div>

      <!-- Último reporte -->
      <div style="
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span style="
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Último Reporte</span>
        </div>
        <div style="margin-bottom: 4px;">
          <span style="
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
          ">${valor.toFixed(2)} <span style="font-size: 12px; font-weight: 500; color: #64748b;">${unidad}</span></span>
        </div>
        <p style="
          font-size: 12px;
          color: #64748b;
          margin: 0;
        ">${formattedDate}</p>
      </div>

      <!-- Año -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        border-top: 1px solid #f1f5f9;
      ">
        <span style="
          font-size: 12px;
          color: #64748b;
        ">Año de registro:</span>
        <span style="
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
        ">${reportYear}</span>
      </div>
    </div>
  `;
};

export default createHeatmapTooltipContent;
