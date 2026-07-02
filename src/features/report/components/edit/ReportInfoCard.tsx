import { Calendar, Droplet, Snowflake } from "lucide-react";
import type { Report } from "@features/report/types";

interface ReportInfoCardProps {
  report: Report;
  isPrecipitacionLluvia: boolean;
}

export const ReportInfoCard = ({ report, isPrecipitacionLluvia }: ReportInfoCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-lg font-bold">
              #{report.id}
            </span>

            {report.report_regular ? (
              <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-semibold">
                Regular
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-sm font-semibold">
                Rotura
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={16} />
            <span className="text-sm font-medium">{report.date}</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isPrecipitacionLluvia ? "bg-blue-100" : "bg-cyan-100"}`}>
          {isPrecipitacionLluvia ? (
            <Droplet className="w-6 h-6 text-blue-600" />
          ) : (
            <Snowflake className="w-6 h-6 text-cyan-600" />
          )}
        </div>
      </div>
    </div>
  );
};