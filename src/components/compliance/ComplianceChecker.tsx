import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ComplianceCheckerProps {
  floorPlanId: string;
}

export function ComplianceChecker({ floorPlanId }: ComplianceCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<any>(null);
  const { toast } = useToast();

  const runComplianceCheck = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('virtual-inspector', {
        body: { 
          floorPlanId,
          locationData: {} // Add location data if needed
        }
      });

      if (error) throw error;
      setReport(data);
      
      toast({
        title: "Compliance Check Complete",
        description: `${data.report_data.summary.passed} checks passed, ${data.report_data.summary.failed} failed`,
        variant: data.report_data.summary.failed > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error running compliance check:', error);
      toast({
        title: "Error",
        description: "Failed to complete compliance check",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Virtual Building Inspector
          <Button 
            onClick={runComplianceCheck} 
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Compliance...
              </>
            ) : (
              'Run Compliance Check'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {report && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-500">
                    {report.report_data.summary.passed}
                  </div>
                  <p className="text-sm text-muted-foreground">Passed Checks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-500">
                    {report.report_data.summary.failed}
                  </div>
                  <p className="text-sm text-muted-foreground">Failed Checks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-500">
                    {report.report_data.summary.warnings}
                  </div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {report.report_data.checks.map((check: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <span>{check.details.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}