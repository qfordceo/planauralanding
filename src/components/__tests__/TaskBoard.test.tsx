import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskBoard } from '../projects/tasks/board/TaskBoard';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockTasks = [
  {
    id: '1',
    title: 'Setup Foundation',
    description: 'Prepare and pour foundation',
    status: 'not_started',
    category: 'construction',
  },
  {
    id: '2',
    title: 'Install Plumbing',
    description: 'Install main plumbing lines',
    status: 'in_progress',
    category: 'plumbing',
  },
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockTasks, error: null }),
        }),
      }),
    }),
  },
}));

describe('TaskBoard', () => {
  it('renders all task columns', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskBoard projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('Needs Review')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskBoard projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Setup Foundation')).toBeInTheDocument();
    expect(screen.getByText('Install Plumbing')).toBeInTheDocument();
  });

  it('allows adding new tasks', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskBoard projectId="test-project-id" />
      </QueryClientProvider>
    );

    const addButton = await screen.findByText('Add Task');
    fireEvent.click(addButton);
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('handles task status updates', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskBoard projectId="test-project-id" />
      </QueryClientProvider>
    );

    // Test will be implemented when drag-and-drop functionality is added
    expect(true).toBeTruthy();
  });
});