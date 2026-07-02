
interface ParametersSummaryProps {
  grupoSeleccionado: "grupo1" | "grupo2" | "grupo3" | "";
  grupo1Data: { ph: string; conductividad: string; na: string };
  grupo2Data: { delta_2h: string; delta_18o: string };
  grupo3Data: { nivel_freatico: string };
}

const ResumenParametros = ({
  grupoSeleccionado,
  grupo1Data,
  grupo2Data,
  grupo3Data,
}: ParametersSummaryProps) => {
  const grupos = {
    grupo1: {
      title: "Muestras Químicas",
      items: [
        { label: "pH", value: grupo1Data.ph },
        { label: "Conductividad (µS/cm)", value: grupo1Data.conductividad },
        { label: "Na (mg/l)", value: grupo1Data.na },
      ],
    },

    grupo2: {
      title: "Isótopos",
      items: [
        { label: "δ2H (‰)", value: grupo2Data.delta_2h },
        { label: "δ¹⁸O (‰)", value: grupo2Data.delta_18o },
      ],
    },

    grupo3: {
      title: "Hidrogeología",
      items: [
        { label: "Nivel Freático (m)", value: grupo3Data.nivel_freatico },
      ],
    },
  };

  const grupo = grupoSeleccionado ? grupos[grupoSeleccionado] : null;

  return (
    <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
      <h4 className="text-xs font-semibold text-cyan-800 uppercase tracking-wide mb-3">
        Resumen de Datos Ingresados
      </h4>

      {!grupoSeleccionado && (
        <div className="text-slate-500 italic">
          Seleccione un grupo para ingresar datos
        </div>
      )}

      {grupoSeleccionado && grupo && (
        <>
          <div className="font-bold text-cyan-700 mb-2">{grupo.title}</div>

          {grupo.items.some((i) => i.value) ? (
            grupo.items
              .filter((i) => i.value)
              .map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5"></div>
                  <span>
                    {i.label}: {i.value}
                  </span>
                </div>
              ))
          ) : (
            <div className="text-slate-500 italic">Sin datos del grupo</div>
          )}
        </>
      )}
    </div>
  );
};


export default ResumenParametros;