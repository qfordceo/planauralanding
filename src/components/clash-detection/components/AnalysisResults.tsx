import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  results: string;
  resolutionNotes?: string;
}

export function AnalysisResults({ results, resolutionNotes }: AnalysisResultsProps) {
  return (
    <>
      <div className="rounded-lg bg-muted p-4">
        <pre className="whitespace-pre-wrap text-sm">
          {results}
        </pre>
      </div>
      {resolutionNotes && (
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="font-medium text-green-900">Resolution Notes</h4>
          <p className="mt-1 text-green-700">{resolutionNotes}</p>
        </div>
      )}
    </>
  );
}