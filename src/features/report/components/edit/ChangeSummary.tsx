
const SummaryChange = ({ formData, report }) => {
  const changes = [
    {
      condition: formData.note !== report.note,
      label: "Nota modificada"
    },
    {
      condition: report.report_regular && formData.amount !== report.report_regular?.amount,
      label: "Cantidad actualizada"
    },
    {
      condition: formData.site_id !== report.site?.id,
      label: "Sitio modificado"
    },
    {
      condition: formData.zona_id !== report.site?.zona_id,
      label: "Zona actualizada"
    }
  ];

  const hasChanges = changes.some(c => c.condition);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
        Resumen de cambios
      </h4>

      <div className="space-y-2 text-sm">
        {hasChanges ? (
          changes
            .filter(item => item.condition)
            .map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            ))
        ) : (
          <div className="text-slate-500 italic">Sin cambios realizados</div>
        )}
      </div>
    </div>
  );
};

export default SummaryChange;
