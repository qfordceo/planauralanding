import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContractWorkflowProps {
  projectId: string;
  onComplete?: () => void;
}

export function ContractWorkflow({ projectId, onComplete }: ContractWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const handleSign = async () => {
    try {
      const { error } = await supabase
        .from('project_contracts')
        .update({ 
          signed_by_client_at: new Date().toISOString(),
          status: 'signed'
        })
        .eq('id', contract?.id);

      if (error) throw error;

      toast({
        title: "Contract signed successfully",
        description: "The project can now proceed to the next phase.",
      });

      onComplete?.();
    } catch (error) {
      toast({
        title: "Error signing contract",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Review & Signing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {contract?.content && (
              <div className="prose max-w-none">
                {Object.entries(contract.content).map(([section, content]) => (
                  <div key={section} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{section}</h3>
                    <p className="text-sm text-muted-foreground">{String(content)}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {contract?.status === 'signed' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Signed on {new Date(contract.signed_by_client_at).toLocaleDateString()}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    Awaiting signature
                  </span>
                </>
              )}
            </div>

            {contract?.status !== 'signed' && (
              <Button onClick={handleSign}>
                Sign Contract
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}