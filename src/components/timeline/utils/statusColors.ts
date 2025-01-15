export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#22c55e';
    case 'in_progress':
      return '#3b82f6';
    case 'pending':
      return '#f59e0b';
    default:
      return '#64748b';
  }
};