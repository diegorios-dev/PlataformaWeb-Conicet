import { CalendarDays } from "lucide-react";

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
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        <label htmlFor="year-filter" className="font-semibold text-sm text-slate-700 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          {label}
        </label>
        <div className="relative">
          <select
            id="year-filter"
            value={selectedYear || "all"}
            onChange={(e) => {
              const value = e.target.value;
              onYearChange(value === "all" ? null : parseInt(value));
            }}
            className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer bg-slate-50 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {showAllOption && <option value="all">{allOptionLabel}</option>}
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
