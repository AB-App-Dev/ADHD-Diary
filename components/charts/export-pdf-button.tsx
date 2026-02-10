"use client";

import { useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { exportChartsToPdf } from "@/lib/pdf-export";

interface ExportPdfButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
  title: string;
  filename: string;
}

export function ExportPdfButton({
  containerRef,
  title,
  filename,
}: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!containerRef.current) return;

    setIsExporting(true);
    try {
      await exportChartsToPdf(containerRef.current, { title, filename });
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exportieren...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          PDF exportieren
        </>
      )}
    </Button>
  );
}
