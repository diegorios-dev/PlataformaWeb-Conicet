import { useEffect, useRef, useState } from "react";
import { getReportsForSites } from "../../../services/sitiosService";

export function useSiteReports(position, siteIds, selectedYear) {
    
  const [siteReports, setSiteReports] = useState(new Map());
  const [loadingReports, setLoadingReports] = useState(true);
  const lastQueryKeyRef = useRef(null);

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!position || position.length === 0) {
        setLoadingReports(false);
        return;
      }
      const queryKey = `${selectedYear ?? 'all'}|${siteIds.join(',')}`;
      if (lastQueryKeyRef.current === queryKey && siteReports.size > 0) {
        setLoadingReports(false);
        return;
      }
      setLoadingReports(true);
      const reportsMap = new Map();
      try {
        const batchResults = await getReportsForSites(siteIds, selectedYear || undefined);
        batchResults.forEach(({ siteId, reports }) => {
          if (!siteId) return;
          if (reports && reports.length > 0) {
            const totalAmount = reports.reduce((acc, report) => {
              const amount = parseFloat(report.amount) || 0;
              return acc + amount;
            }, 0);
            const lastReport = reports[reports.length - 1];
            const lastReportAmount = parseFloat(lastReport.amount) || 0;
            const lastReportDate = lastReport.report?.date || null;
            reportsMap.set(siteId, {
              totalAmount,
              lastReportAmount,
              lastReportDate
            });
          } else {
            reportsMap.set(siteId, {
              totalAmount: 0,
              lastReportAmount: 0,
              lastReportDate: null
            });
          }
        });
        setSiteReports(reportsMap);
        lastQueryKeyRef.current = queryKey;
      } catch {
        // error
      } finally {
        setLoadingReports(false);
      }
    };
    fetchAllReports();
  }, [position, siteIds, selectedYear]);

  return { siteReports, loadingReports };
}
