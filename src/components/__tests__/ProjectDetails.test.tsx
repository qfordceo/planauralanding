import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectDetails } from '../projects/ProjectDetails';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockProject = {
  id: 'test-project-id',
  title: 'Test Project',
  description: 'Test Description',
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockProject, error: null }),
        }),
      }),
    }),
  },
}));

describe('ProjectDetails', () => {
  it('renders project overview', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectDetails projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('shows all project tabs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectDetails projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
    expect(screen.getByText('Disputes')).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectDetails projectId="test-project-id" />
      </QueryClientProvider>
    );

    const timelineTab = await screen.findByText('Timeline');
    fireEvent.click(timelineTab);
    expect(screen.getByText('Project Timeline')).toBeInTheDocument();

    const tasksTab = screen.getByText('Tasks');
    fireEvent.click(tasksTab);
    expect(screen.getByText('Project Tasks')).toBeInTheDocument();
  });
});