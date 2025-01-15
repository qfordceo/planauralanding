import { TaskStatus } from '../types';

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'completed':
      return '#4ade80'; // green-400
    case 'in_progress':
      return '#60a5fa'; // blue-400
    case 'blocked':
      return '#f87171'; // red-400
    case 'not_started':
    default:
      return '#94a3b8'; // slate-400
  }
};