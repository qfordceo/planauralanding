export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e'; // green-500
    case 'in_progress':
      return '#3b82f6'; // blue-500
    case 'blocked':
      return '#ef4444'; // red-500
    case 'needs_review':
      return '#f59e0b'; // amber-500
    default:
      return '#94a3b8'; // slate-400
  }
}