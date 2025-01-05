import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflowManager } from '../../contracts/ContractWorkflowManager';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

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

describe('ContractWorkflowManager Basic Tests', () => {
  beforeEach(() => {
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockContract, error: null })
        })
      })
    } as any);
  });

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
});