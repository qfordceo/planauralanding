import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflowManager } from '../../contracts/ContractWorkflowManager';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient();

describe('ContractWorkflowManager Error Handling', () => {
  it('handles network errors gracefully', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.reject(new Error('Network error'))
        })
      })
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles invalid contract data', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Invalid contract') })
        })
      })
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles malformed contract data', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ 
            data: { 
              id: 'test-contract',
              status: 'invalid-status',
              workflow_stage: 'invalid-stage'
            }, 
            error: null 
          })
        })
      })
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});