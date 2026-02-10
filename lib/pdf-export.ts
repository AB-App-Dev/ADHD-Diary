import { jsPDF } from "jspdf";

interface SessionInfo {
  medicationName: string;
  dosage: string;
  monitoringFrom: string;
  monitoringTo: string;
  workdayCount: number;
  weekendCount: number;
}

interface ChartImage {
  title: string;
  dataUrl: string;
}

export async function exportChartsToPdf(
  chartImages: ChartImage[],
  sessionInfo: SessionInfo
): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Analytics Report: ${sessionInfo.medicationName}`, margin, margin + 10);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Dosierung: ${sessionInfo.dosage}`, margin, margin + 20);
  pdf.text(
    `Zeitraum: ${sessionInfo.monitoringFrom} - ${sessionInfo.monitoringTo}`,
    margin,
    margin + 26
  );
  pdf.text(
    `Einträge: ${sessionInfo.workdayCount} Werktage, ${sessionInfo.weekendCount} Wochenenden`,
    margin,
    margin + 32
  );

  let yPosition = margin + 45;

  // Add each chart
  for (let i = 0; i < chartImages.length; i++) {
    const chart = chartImages[i];

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    // Chart title
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(chart.title, margin, yPosition);
    yPosition += 5;

    // Add chart image
    const imgHeight = 55;
    pdf.addImage(chart.dataUrl, "PNG", margin, yPosition, contentWidth, imgHeight);
    yPosition += imgHeight + 15;
  }

  // Save
  const filename = `analytics-${sessionInfo.medicationName.toLowerCase().replace(/\s+/g, "-")}`;
  pdf.save(`${filename}.pdf`);
}
