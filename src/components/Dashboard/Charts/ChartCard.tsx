import { useState, memo } from "react";
import { HelpCircle, Calendar, ChevronDown, Check, Database, CalendarDays, CalendarClock, CalendarRange, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from "lucide-react";
import img from "../../../../public/assets/logo-CONICET_opt.png";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  showPeriodSelector?: boolean;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

// ⚡ Memorizar componente para evitar re-renders innecesarios
const ChartCard = memo(({ 
  title, 
  subtitle, 
  description, 
  icon, 
  children, 
  isLoading,
  showPeriodSelector = false,
  selectedPeriod = "todos",
  onPeriodChange
}: ChartCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periodIcons: Record<string, React.ReactNode> = {
    "todos": <Database className="w-3.5 h-3.5" />,
    "trimestre": <Calendar className="w-3.5 h-3.5" />,
    "6meses": <CalendarDays className="w-3.5 h-3.5" />,
    "anio": <CalendarClock className="w-3.5 h-3.5" />,
    "5anios": <TrendingUpIcon className="w-3.5 h-3.5" />,
    "10anios": <CalendarRange className="w-3.5 h-3.5" />,
  };

  const periods = [
    { value: "todos", label: "Todos los datos" },
    { value: "trimestre", label: "Últimos 3 meses" },
    { value: "6meses", label: "Últimos 6 meses" },
    { value: "anio", label: "Último año" },
    { value: "5anios", label: "Últimos 5 años" },
    { value: "10anios", label: "Últimos 10 años" },
  ];

  const selectedOption = periods.find(p => p.value === selectedPeriod);

  const handleSelect = (value: string) => {
    if (onPeriodChange) {
      onPeriodChange(value);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="backdrop-blur-2xl bg-white/70 border border-white/60 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {description && (
              <div className="relative">
                <div
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="cursor-help"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                </div>
                {showTooltip && (
                  <div className="absolute left-0 top-6 z-50 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg animate-fade-in">
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                    {description}
                  </div>
                )}
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        
        {showPeriodSelector && onPeriodChange && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="text-blue-600">
                {selectedOption && periodIcons[selectedOption.value]}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {selectedOption?.label}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 backdrop-blur-xl bg-white/95 border border-blue-200/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => handleSelect(period.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150 ${
                        period.value === selectedPeriod
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'hover:bg-blue-50 text-slate-700'
                      }`}
                    >
                      <div className={period.value === selectedPeriod ? 'text-white' : 'text-blue-600'}>
                        {periodIcons[period.value]}
                      </div>
                      <span className="flex-1 text-xs font-medium">{period.label}</span>
                      {period.value === selectedPeriod && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    {isLoading ? (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    ) : (
      <div className="relative mt-4">
        {children}
        {/* Marca de agua - Grande y centrada sobre el gráfico */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
          <img 
            src={img} 
            alt="Watermark"
            className="w-27 h-20 opacity-70"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
            }}
          />
        </div>
      </div>
    )}
  </div>
);
});

// ⚡ Nombre de display para debugging
ChartCard.displayName = 'ChartCard';

export default ChartCard;
