import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientDashboard } from '../client/ClientDashboard';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockActiveProject = {
  id: 'test-project',
  title: 'Test Project',
  description: 'Test Description',
  status: 'active',
  project_contracts: [
    {
      id: 'test-contract',
      status: 'draft'
    }
  ]
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockActiveProject, error: null })
          })
        })
      })
    })
  }
}));

describe('ClientDashboard', () => {
  it('renders timeline for active project', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ClientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });
  });

  it('renders documents tab', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ClientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });
  });

  it('renders communication tab', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ClientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Communication')).toBeInTheDocument();
    });
  });

  it('shows welcome message when no active project', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      })
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <ClientDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome to Your Dashboard')).toBeInTheDocument();
    });
  });
});