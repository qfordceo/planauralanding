import { ErrorBoundary } from "@/components/ErrorBoundary";

export function WorkflowErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}