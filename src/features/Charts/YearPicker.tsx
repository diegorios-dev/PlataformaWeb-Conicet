import { useState, useRef } from "react";
import { Check, X, Calendar } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface YearPickerProps {
  availableYears: number[];
  selectedYears: number[];
  onYearsChange: (years: number[]) => void;
  maxSelection?: number;
}

const YearPicker = ({ 
  availableYears = [], 
  selectedYears = [], 
  onYearsChange,
  maxSelection = 10 
}: YearPickerProps) => {
  const [currentYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState(10); // Cantidad de años a mostrar en el scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Generar años basados en el rango seleccionado
  const allYears = availableYears.length > 0 
    ? availableYears.sort((a, b) => b - a)
    : Array.from({ length: 30 }, (_, i) => currentYear - i); // Pool de 30 años
  
  // Tomar solo los años según el rango seleccionado
  const years = allYears.slice(0, yearRange);

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      // Remover año
      onYearsChange(selectedYears.filter(y => y !== year));
    } else {
      // Agregar año si no excede el máximo
      if (selectedYears.length < maxSelection) {
        onYearsChange([...selectedYears, year].sort((a, b) => b - a));
      }
    }
  };

  const selectAll = () => {
    const yearsToSelect = years.slice(0, Math.min(maxSelection, years.length));
    onYearsChange(yearsToSelect);
  };

  const clearAll = () => {
    onYearsChange([]);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      {/* Header con controles */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">
            Seleccionar años
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {selectedYears.length}/{maxSelection}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botones de control */}
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              disabled={selectedYears.length === maxSelection}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Todos
            </button>
            <button
              onClick={clearAll}
              disabled={selectedYears.length === 0}
              className="text-xs text-red-600 hover:text-red-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          </div>
          
          {/* Selector de rango */}
          <div className="w-44">
            <CustomSelect
              options={[
                { value: "5", label: "5 años", icon: <Calendar className="w-4 h-4" /> },
                { value: "10", label: "10 años", icon: <Calendar className="w-4 h-4" /> },
                { value: "15", label: "15 años", icon: <Calendar className="w-4 h-4" /> },
                { value: "20", label: "20 años", icon: <Calendar className="w-4 h-4" /> },
                { value: "30", label: "30 años", icon: <Calendar className="w-4 h-4" /> },
              ]}
              value={yearRange.toString()}
              onChange={(value) => setYearRange(Number(value))}
              placeholder="Mostrar años"
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Scroll horizontal tipo "candado de valija" */}
      <div className="relative pb-3">
        {/* Indicadores de scroll (gradientes en los bordes) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none"></div>

        {/* Contenedor scrolleable */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`
            flex gap-2 overflow-x-auto pb-4 px-8 pt-2
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            scrollbarWidth: 'thin',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
          }}
        >
          {years.map((year) => {
            const isSelected = selectedYears.includes(year);
            const isCurrentYear = year === currentYear;
            const isDisabled = !isSelected && selectedYears.length >= maxSelection;

            return (
              <button
                key={year}
                onClick={() => !isDisabled && toggleYear(year)}
                disabled={isDisabled}
                className={`
                  relative flex-shrink-0 w-16 h-20 rounded-xl
                  border-2 transition-all duration-200
                  ${isSelected 
                    ? isCurrentYear
                      ? 'border-orange-400 bg-gradient-to-b from-orange-100 to-orange-200 shadow-lg scale-105'
                      : 'border-blue-400 bg-gradient-to-b from-blue-100 to-blue-200 shadow-lg scale-105'
                    : isDisabled
                      ? 'border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed'
                      : 'border-slate-300 bg-white hover:border-blue-300 hover:shadow-md hover:scale-105'
                  }
                  ${!isDisabled && !isSelected ? 'hover:bg-gradient-to-b hover:from-blue-50 hover:to-blue-100' : ''}
                `}
              >
                {/* Número del año - estilo "candado digital" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`
                    text-2xl font-bold tracking-tight
                    ${isSelected 
                      ? isCurrentYear ? 'text-orange-700' : 'text-blue-700'
                      : 'text-slate-600'
                    }
                  `}>
                    {year}
                  </div>
                </div>

                {/* Indicador de selección */}
                {isSelected && (
                  <div className={`
                    absolute -top-1 -right-1 w-5 h-5 rounded-full
                    flex items-center justify-center
                    ${isCurrentYear ? 'bg-orange-500' : 'bg-blue-500'}
                    shadow-lg animate-scale-in
                  `}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Badge de año actual */}
                {isCurrentYear && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    Actual
                  </div>
                )}

                {/* Efecto de "dígitos" tipo candado */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200/50"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info adicional */}
      {selectedYears.length === maxSelection && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
          <span>Máximo de {maxSelection} años alcanzado</span>
        </div>
      )}

      {/* Lista de años seleccionados */}
      {selectedYears.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          <span className="text-xs text-slate-600 font-medium">Comparando:</span>
          {selectedYears.sort((a, b) => b - a).map((year) => (
            <span
              key={year}
              className={`
                text-xs font-semibold px-2 py-1 rounded-lg
                ${year === currentYear 
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
                }
              `}
            >
              {year}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearPicker;
