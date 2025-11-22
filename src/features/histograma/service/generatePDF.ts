import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { months } from "../contants/constants";

export async function generatePDF({
  title,
  periodo,
  year,
  month,
  data,
  chartRef,
  filenamePrefix,
  pdfQuality
}) {
  if (!chartRef.current || !data) return;

  await new Promise(res => setTimeout(res, 300));

  const canvas = await html2canvas(chartRef.current, {
    scale: pdfQuality,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  pdf.setProperties({
    title,
    author: "precipitacionWeb",
    keywords: "histograma, precipitacion, pdf"
  });

  pdf.setFontSize(18);
  pdf.text(title, 148, 15, { align: "center" });

  let filterText = `Período: ${periodo}`;
  if (periodo !== "todos") filterText += ` - Año: ${year}`;
  if (periodo === "dia") filterText += ` - Mes: ${months.find(m => m.value === month)?.label}`;

  pdf.setFontSize(12);
  pdf.text(filterText, 148, 25, { align: "center" });

  const imgWidth = 260;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 18, 35, imgWidth, imgHeight);

  if (Array.isArray(data) && data.length > 0) {
    const columns = Object.keys(data[0]).map(key => ({ header: key, dataKey: key }));
    const rows = data.map(row => ({ ...row }));

    autoTable(pdf, {
      startY: 40 + imgHeight,
      head: [columns.map(col => col.header)],
      body: rows.map(r => columns.map(c => r[c.dataKey])),
      theme: "grid",
      styles: { fontSize: 10 }
    });
  }

  pdf.save(`${filenamePrefix}-${periodo}-${year}.pdf`);
}
