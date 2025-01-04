import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { LoanPrequalification } from "./steps/LoanPrequalification";
import { LandSelection } from "./steps/LandSelection";
import { FloorPlanSelection } from "./steps/FloorPlanSelection";
import { MaterialsSelection } from "./steps/MaterialsSelection";
import { ContractorSelection } from "./steps/ContractorSelection";

type OnboardingStep = "prequalification" | "land" | "floorplan" | "materials" | "contractor";

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("prequalification");
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps: OnboardingStep[] = ["prequalification", "land", "floorplan", "materials", "contractor"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      toast({
        title: "Onboarding Complete",
        description: "You're all set to start your building journey!",
      });
      navigate("/client-dashboard");
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "prequalification":
        return <LoanPrequalification onNext={handleNext} />;
      case "land":
        return <LandSelection onNext={handleNext} onBack={handleBack} />;
      case "floorplan":
        return <FloorPlanSelection onNext={handleNext} onBack={handleBack} />;
      case "materials":
        return <MaterialsSelection onNext={handleNext} onBack={handleBack} />;
      case "contractor":
        return <ContractorSelection onNext={handleNext} onBack={handleBack} />;
    }
  };

  const stepTitles = {
    prequalification: "Loan Pre-qualification",
    land: "Land Selection",
    floorplan: "Floor Plan Selection",
    materials: "Materials Selection",
    contractor: "Contractor Selection"
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{stepTitles[currentStep]}</h2>
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`${
                  currentStepIndex >= index ? "text-primary" : ""
                }`}
              >
                Step {index + 1}
              </span>
            ))}
          </div>
        </div>

        {renderStep()}
      </Card>
    </div>
  );
}