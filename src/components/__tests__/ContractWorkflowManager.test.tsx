import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflowManager } from '../contracts/ContractWorkflowManager';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockContract, error: null })
        })
      })
    })
  }
}));

const queryClient = new QueryClient();

const mockContract = {
  id: 'test-contract',
  status: 'draft',
  workflow_stage: 'setup',
  content: {
    terms: 'Test terms',
    scope: 'Test scope',
    payment_schedule: 'Test schedule'
  }
};

describe('ContractWorkflowManager', () => {
  it('renders loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders workflow content after loading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    const mockSupabase = vi.mocked(supabase);
    mockSupabase.from = vi.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Test error') })
        })
      })
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('shows correct workflow stage based on contract status', async () => {
    const customMockContract = {
      ...mockContract,
      workflow_stage: 'client_review'
    };

    const mockSupabase = vi.mocked(supabase);
    mockSupabase.from = vi.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: customMockContract, error: null })
        })
      })
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Contract Review/i)).toBeInTheDocument();
    });
  });
});