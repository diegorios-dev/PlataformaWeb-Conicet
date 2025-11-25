

interface HeatmapTooltipProps {
  nombre: string;
  valor: number;
  unidad: string;
  fecha: string;
  eventType: string;
}

export const createHeatmapTooltipContent = (props: HeatmapTooltipProps): string => {
  const { nombre, valor, unidad, fecha, eventType } = props;
  
  // Determinar el icono y color según el tipo de evento
  const getEventConfig = () => {
    const type = eventType.toLowerCase();
    if (type.includes("nieve")) {
      return {
        color: "#0ea5e9", // cyan-500
        bgColor: "#e0f2fe", // cyan-50
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <path d="m5 5 14 14"></path>
          <path d="m19 5-14 14"></path>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="m15.5 8.5-7 7"></path>
          <path d="m8.5 8.5 7 7"></path>
        </svg>` // Snowflake icon
      };
    } else if (type.includes("caudal")) {
      return {
        color: "#06b6d4", // cyan-500
        bgColor: "#cffafe", // cyan-100
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7.916 3.75A7.05 7.05 0 0 1 12 2.99a7.05 7.05 0 0 1 4.084.76 6.91 6.91 0 0 1 2.876 2.876 7.05 7.05 0 0 1 .76 4.084 7.05 7.05 0 0 1-.76 4.084 6.91 6.91 0 0 1-2.876 2.876 7.05 7.05 0 0 1-4.084.76 7.05 7.05 0 0 1-4.084-.76 6.91 6.91 0 0 1-2.876-2.876 7.05 7.05 0 0 1-.76-4.084 7.05 7.05 0 0 1 .76-4.084A6.91 6.91 0 0 1 7.916 3.75Z"></path>
          <path d="M7 15.416S8.5 13.917 12 13.917s5 1.5 5 1.5"></path>
        </svg>` // Waves icon
      };
    } else {
      return {
        color: "#3b82f6", // blue-500
        bgColor: "#dbeafe", // blue-50
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>` // Droplet icon
      };
    }
  };

  const config = getEventConfig();

  return `
    <div style="
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
      backdrop-filter: blur(12px);
      border-radius: 12px;
      padding: 12px;
      min-width: 200px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.8);
    ">
      <!-- Header con ubicación -->
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(226, 232, 240, 0.6);
      ">
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}20 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          ${config.icon}
        </div>
        <div style="flex: 1;">
          <div style="
            font-weight: 700;
            font-size: 14px;
            color: #1e293b;
            line-height: 1.2;
          ">${nombre}</div>
        </div>
      </div>

      <!-- Valor principal -->
      <div style="
        background: linear-gradient(135deg, ${config.bgColor} 0%, ${config.color}15 100%);
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 8px;
        border: 1px solid ${config.color}40;
      ">
        <div style="
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        ">Medición</div>
        <div style="
          font-size: 22px;
          font-weight: 800;
          color: ${config.color};
          display: flex;
          align-items: baseline;
          gap: 4px;
        ">
          <span>${valor}</span>
          <span style="font-size: 14px; font-weight: 600; color: #64748b;">${unidad}</span>
        </div>
      </div>

      <!-- Fecha -->
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        background: rgba(241, 245, 249, 0.6);
        border-radius: 8px;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span style="
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        ">${fecha}</span>
      </div>
    </div>
  `;
};

export default createHeatmapTooltipContent;
