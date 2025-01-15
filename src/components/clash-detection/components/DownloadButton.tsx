import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  report: {
    id: string;
    analysis_results: string;
    resolution_notes?: string;
  };
}

export function DownloadButton({ report }: DownloadButtonProps) {
  const handleDownload = () => {
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clash-report-${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      Download Report
    </Button>
  );
}