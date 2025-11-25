import { useState, useRef, useEffect, memo } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string | number;
  label: string;
  icon?: ReactNode;
  subtitle?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = memo(({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  icon,
  className = "",
  disabled = false
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-3 
          px-4 py-3 
          backdrop-blur-xl bg-white/95 
          border border-blue-200/50 
          rounded-xl 
          shadow-sm hover:shadow-md 
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300/70'}
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
        `}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          
          {selectedOption ? (
            <div className="flex items-center gap-2.5 flex-1">
              {selectedOption.icon && (
                <div className="text-slate-600 flex-shrink-0">
                  {selectedOption.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-700 block truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.subtitle && (
                  <span className="text-xs text-slate-500 block truncate">
                    {selectedOption.subtitle}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-sm text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-blue-600 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay transparente para cerrar */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute left-0 right-0 top-full mt-2 backdrop-blur-xl bg-white/95 border border-blue-200/50 rounded-xl shadow-2xl overflow-hidden z-[9999] animate-fade-in max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left 
                  transition-all duration-150
                  ${
                    option.value === value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'hover:bg-blue-50 text-slate-700'
                  }
                `}
              >
                {option.icon && (
                  <div className={`flex-shrink-0 ${option.value === value ? 'text-white' : 'text-slate-600'}`}>
                    {option.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">
                    {option.label}
                  </span>
                  {option.subtitle && (
                    <span className={`text-xs block truncate ${
                      option.value === value ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {option.subtitle}
                    </span>
                  )}
                </div>
                {option.value === value && (
                  <Check className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

export { CustomSelect };
export type { SelectOption, CustomSelectProps };
