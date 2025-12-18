/**
 * Types for Site Reports Summary API
 * Represents aggregated report data for sites
 */

export interface LastReportInfo {
  amount: number;
  date: string;
  unit?: string;
}

export interface SiteReportSummary {
  siteId: number;
  totalAmount: number;
  reportCount: number;
  lastReport: LastReportInfo;
}

export interface SiteReportsSummaryResponse {
  data: SiteReportSummary[];
}

export interface SiteReportsSummaryParams {
  siteIds: number[];
  year?: number;
}
