interface ReportCardInfoProps {
  date: string;
  note?: string;
  amount?: number;
  unitAbbreviation?: string;
}

export const ReportCardInfo = ({ date, note, amount, unitAbbreviation }: ReportCardInfoProps) => {
  return (
    <div className="flex-1 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-slate-500 text-base font-medium min-w-[70px]">Fecha:</span>
        <span className="text-slate-800 text-base font-bold">{date}</span>
      </div>
      
      {note && (
        <div className="flex items-start gap-2">
          <span className="text-slate-500 text-base font-medium min-w-[70px]">Nota:</span>
          <span className="text-slate-700 text-base italic line-clamp-2">{note}</span>
        </div>
      )}

      {amount && unitAbbreviation && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg shadow-blue-500/10">
          <span className="text-blue-900 font-bold text-2xl">
            {amount} {unitAbbreviation}
          </span>
        </div>
      )}
    </div>
  );
};