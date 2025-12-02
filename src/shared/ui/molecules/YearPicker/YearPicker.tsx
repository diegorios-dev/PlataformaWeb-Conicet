import { CalendarDays, Calendar } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface YearPickerProps {
  availableYears: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  label?: string;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export const YearPicker = ({ 
  availableYears, 
  selectedYear, 
  onYearChange,
  label = "Filtrar por año:",
  className = "",
  showAllOption = true,
  allOptionLabel = "Todos los años"
}: YearPickerProps) => {
  return (
    <div className={className}>
      <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl w-60">
        <label htmlFor="year-filter" className="text-xs font-bold text-white flex items-center gap-2 mb-3 tracking-wide uppercase">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          {label}
        </label>
        <CustomSelect
          options={[
            ...(showAllOption ? [{
              value: "all",
              label: allOptionLabel,
              icon: <CalendarDays className="w-4 h-4" />
            }] : []),
            ...availableYears.map(year => ({
              value: year.toString(),
              label: year.toString(),
              icon: <Calendar className="w-4 h-4" />
            }))
          ]}
          value={selectedYear?.toString() || "all"}
          onChange={(value) => {
            onYearChange(value === "all" ? null : parseInt(String(value)));
          }}
          placeholder="Seleccione año"
          icon={<CalendarDays className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};
