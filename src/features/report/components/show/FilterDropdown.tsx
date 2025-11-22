import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3.5" ref={dropdownRef}>
      <label className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 uppercase tracking-[0.08em] px-0.5">
        <div className="p-1.5 bg-blue-50 rounded-lg">{icon}</div>
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-5 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-300 
            shadow-sm active:scale-[0.98] flex items-center justify-between gap-2
            ${
              value === "all"
                ? "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200/80"
                : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2"
            }`}
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon}
            {selectedOption?.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[14px] shadow-2xl shadow-slate-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-medium text-[14px] transition-all duration-200 flex items-center gap-2
                  ${
                    option.value === value
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
