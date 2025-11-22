
export function buildReportPayload({ formData, waterQuality, report }: any) {
    
  const payload: any = {
    note: formData.note,
    site_id: Number(formData.site_id),
    zona_id: Number(formData.zona_id),
  };

  if (report.report_regular) {
    payload.report_regular = {
      amount: Number(formData.amount),
    };
  }

  if (waterQuality && Object.keys(waterQuality).length > 0) {
    payload.water_quality = waterQuality;
  }

  return payload;
}
