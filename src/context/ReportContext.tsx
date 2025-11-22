import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

interface ReportContextType {
  report: any;
  handleSelectReport: (report: any) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [report, setReport] = useState<any | null>(null);

  const handleSelectReport = useCallback((newReport: any) => {
    setReport(newReport);
  }, []);

  const value = useMemo(
    () => ({
      report,
      handleSelectReport
    }),
    [report, handleSelectReport]
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReportSelection = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportSelection debe usarse dentro de ReportProvider');
  }
  return context;
};
