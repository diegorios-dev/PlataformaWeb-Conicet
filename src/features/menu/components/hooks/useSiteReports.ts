import { useEffect, useRef, useState } from "react";
import { getSiteReportsSummary } from "@features/site/services/sitesServices";
import { devLog } from "@shared/utils/errorHandler";

interface SiteReportData {
  totalAmount: number;
  lastReportAmount: number;
  lastReportDate: string | null;
}

/**
 * Custom hook to fetch aggregated report summaries for multiple sites.
 * Uses optimized backend endpoint that calculates totals in SQL instead of JavaScript.
 * 
 * @param position - Array of site coordinates (used for validation)
 * @param siteIds - Array of site IDs to fetch reports for
 * @param selectedYear - Optional year filter
 * @returns Object containing siteReports Map and loading state
 */
export function useSiteReports(
  position: any[], 
  siteIds: number[], 
  selectedYear: number | null
) {
  const [siteReports, setSiteReports] = useState<Map<number, SiteReportData>>(new Map());
  const [loadingReports, setLoadingReports] = useState(true);
  const lastQueryKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchReportsSummary = async () => {
      // Early return if no sites
      if (!position || position.length === 0 || !siteIds || siteIds.length === 0) {
        setSiteReports(new Map());
        setLoadingReports(false);
        return;
      }

      // Generate cache key to avoid redundant fetches
      const queryKey = `${selectedYear ?? 'all'}|${siteIds.join(',')}`;
      
      // Skip if query hasn't changed and we have data
      if (lastQueryKeyRef.current === queryKey && siteReports.size > 0) {
        setLoadingReports(false);
        return;
      }

      setLoadingReports(true);

      try {
        // ✅ OPTIMIZED: Backend calculates SUM and finds last report in SQL
        const summaries = await getSiteReportsSummary(siteIds, selectedYear || undefined);
        
        const reportsMap = new Map<number, SiteReportData>();

        summaries.forEach((summary) => {
          reportsMap.set(summary.siteId, {
            totalAmount: summary.totalAmount,
            lastReportAmount: summary.lastReport.amount,
            lastReportDate: summary.lastReport.date
          });
        });

        setSiteReports(reportsMap);
        lastQueryKeyRef.current = queryKey;
      } catch (error) {
        devLog.error('Error fetching site reports summary', error);
        // Set empty map on error
        setSiteReports(new Map());
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReportsSummary();
  }, [siteIds, selectedYear]); // Only depend on IDs and year, not position array

  return { siteReports, loadingReports };
}
