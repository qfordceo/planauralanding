export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#22c55e'; // green-500
    case 'in_progress':
      return '#3b82f6'; // blue-500
    case 'blocked':
      return '#ef4444'; // red-500
    case 'not_started':
      return '#94a3b8'; // slate-400
    default:
      return '#64748b'; // slate-500
  }
};

export const getPhaseColor = (phase: string): string => {
  switch (phase) {
    case 'planning':
      return '#a855f7'; // purple-500
    case 'foundation':
      return '#0ea5e9'; // sky-500
    case 'framing':
      return '#f97316'; // orange-500
    case 'mechanical':
      return '#84cc16'; // lime-500
    case 'finishing':
      return '#14b8a6'; // teal-500
    case 'inspection':
      return '#f59e0b'; // amber-500
    default:
      return '#64748b'; // slate-500
  }
};