export const mapBaseOptions = [
  { value: "original", label: "Mapa Estándar" },
  { value: "vegetacion", label: "Satelital" },
  { value: "topografia", label: "Topografía + Ríos" },
];

import L from "leaflet";
import iconHealthy from "../../../public/assets/iconReporteRegular.png";
import iconBroken from "../../../public/assets/iconReporteIntrumentroRoto.png";

export const getCustomIcon = (isHealthy: boolean = true) => {
  const iconSrc = isHealthy ? iconHealthy : iconBroken;

  return L.divIcon({
    className: "",
    html: `
      <div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center">
        <img src="${iconSrc}" style="width:48px;height:48px" />
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};
