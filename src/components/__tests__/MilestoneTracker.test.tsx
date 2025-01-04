import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MilestoneTracker } from '../milestones/MilestoneTracker';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockMilestones = [
  {
    id: '1',
    title: 'Foundation',
    description: 'Complete foundation work',
    status: 'completed',
    due_date: new Date().toISOString(),
    approval_status: 'pending',
  },
  {
    id: '2',
    title: 'Framing',
    description: 'Complete framing work',
    status: 'in_progress',
    due_date: new Date().toISOString(),
    approval_status: 'pending',
  },
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockMilestones, error: null }),
        }),
      }),
    }),
  },
}));

describe('MilestoneTracker', () => {
  it('renders milestone list', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MilestoneTracker projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Foundation')).toBeInTheDocument();
    expect(screen.getByText('Framing')).toBeInTheDocument();
  });

  it('shows milestone progress', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MilestoneTracker projectId="test-project-id" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Project Progress')).toBeInTheDocument();
    // One out of two milestones completed = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('allows milestone approval when completed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MilestoneTracker projectId="test-project-id" />
      </QueryClientProvider>
    );

    const approveButton = await screen.findByText('Approve');
    expect(approveButton).toBeInTheDocument();
    fireEvent.click(approveButton);
    
    // Verify approval action
    expect(screen.getByText('Milestone approved')).toBeInTheDocument();
  });
});