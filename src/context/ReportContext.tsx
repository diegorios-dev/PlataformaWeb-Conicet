import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Report } from '@features/report/types';

interface ReportContextType {
  report: Report | null;
  handleSelectReport: (report: Report) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [report, setReport] = useState<Report | null>(null);

  const handleSelectReport = useCallback((newReport: Report) => {
    setReport(newReport);
  }, []);

  const value = useMemo(
    () => ({report,handleSelectReport}),
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
