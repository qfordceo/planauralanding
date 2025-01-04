import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContractSetupState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Setup Required</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          No contract has been created for this project yet.
        </p>
      </CardContent>
    </Card>
  );
}