// src/components/YearSelector.tsx
import React from "react";
import { CalendarDays } from "lucide-react";

interface Props {
  availableYears: number[];
  selectedYear: number | null;
  setSelectedYear: (y: number | null) => void;
}

export const YearSelector: React.FC<Props> = ({ availableYears, selectedYear, setSelectedYear }) => {
  return (
    <div className="absolute top-5 right-5 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3">
        <label htmlFor="year-filter" className="font-semibold text-sm text-slate-700 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          Filtrar por año:
        </label>
        <div className="relative">
          <select
            id="year-filter"
            value={selectedYear || "all"}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedYear(value === "all" ? null : parseInt(value));
            }}
            className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer bg-slate-50 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">Todos los años</option>
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
