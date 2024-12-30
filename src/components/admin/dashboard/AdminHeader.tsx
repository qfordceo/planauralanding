import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminHeaderProps {
  error: string | null;
}

export function AdminHeader({ error }: AdminHeaderProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
    </div>
  );
}