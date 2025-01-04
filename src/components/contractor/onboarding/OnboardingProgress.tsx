import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingStep } from "@/types/contractor";

export function OnboardingProgress({ contractorId }: { contractorId: string }) {
  const { data: steps, isLoading } = useQuery({
    queryKey: ["onboarding-progress", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_onboarding_progress")
        .select("*")
        .eq("contractor_id", contractorId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as OnboardingStep[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const completedSteps = steps?.filter((step) => step.completed).length ?? 0;
  const totalSteps = steps?.length ?? 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Onboarding Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedSteps} of {totalSteps} steps completed
          </p>
          <div className="space-y-2">
            {steps?.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between py-2"
              >
                <span className="flex items-center gap-2">
                  {step.completed ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                  {step.step_name}
                </span>
                {step.completed_at && (
                  <span className="text-sm text-muted-foreground">
                    {new Date(step.completed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}