import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BusinessEntityForm } from "@/components/contractor/registration/BusinessEntityForm";
import { WorkersCompForm } from "@/components/contractor/registration/WorkersCompForm";
import { BBBVerificationForm } from "@/components/contractor/registration/BBBVerificationForm";
import { W9Form } from "@/components/contractor/registration/W9Form";
import { LicenseVerificationForm } from "@/components/contractor/registration/LicenseVerificationForm";
import { TimelineAgreementForm } from "@/components/contractor/registration/TimelineAgreementForm";

const steps = [
  { id: "business", title: "Business Entity", path: "business-entity" },
  { id: "workers-comp", title: "Workers Compensation", path: "workers-comp" },
  { id: "bbb", title: "BBB Verification", path: "bbb-verification" },
  { id: "w9", title: "W-9 Submission", path: "w9-submission" },
  { id: "license", title: "License Verification", path: "license-verification" },
  { id: "timeline", title: "Timeline Agreement", path: "timeline-agreement" },
];

export default function ContractorRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = (currentStep / (steps.length - 1)) * 100;

  const handleStepComplete = (stepId: string) => {
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      navigate(`/contractor-registration/${steps[nextStep].path}`);
    } else {
      toast({
        title: "Registration Complete",
        description: "Your contractor profile has been created successfully.",
      });
      navigate("/contractor-dashboard");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Contractor Registration</h1>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-sm ${
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        <Routes>
          {/* Add a redirect from the base path to the first step */}
          <Route
            index
            element={<Navigate to={`/contractor-registration/${steps[0].path}`} replace />}
          />
          <Route
            path="business-entity"
            element={
              <BusinessEntityForm onComplete={() => handleStepComplete("business")} />
            }
          />
          <Route
            path="workers-comp"
            element={
              <WorkersCompForm onComplete={() => handleStepComplete("workers-comp")} />
            }
          />
          <Route
            path="bbb-verification"
            element={
              <BBBVerificationForm onComplete={() => handleStepComplete("bbb")} />
            }
          />
          <Route
            path="w9-submission"
            element={<W9Form onComplete={() => handleStepComplete("w9")} />}
          />
          <Route
            path="license-verification"
            element={
              <LicenseVerificationForm onComplete={() => handleStepComplete("license")} />
            }
          />
          <Route
            path="timeline-agreement"
            element={
              <TimelineAgreementForm onComplete={() => handleStepComplete("timeline")} />
            }
          />
          {/* Add a catch-all redirect to the first step */}
          <Route
            path="*"
            element={<Navigate to={`/contractor-registration/${steps[0].path}`} replace />}
          />
        </Routes>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
                navigate(`/contractor-registration/${steps[currentStep - 1].path}`);
              }
            }}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/contractor-resources")}
          >
            View Resources
          </Button>
        </div>
      </Card>
    </div>
  );
}