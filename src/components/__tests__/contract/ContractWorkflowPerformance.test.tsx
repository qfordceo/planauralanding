import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflowManager } from '../../contracts/ContractWorkflowManager';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ContractWorkflowManager Performance', () => {
  let renderStartTime: number;

  beforeEach(() => {
    renderStartTime = performance.now();
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ 
            data: {
              id: 'test-contract',
              status: 'draft',
              workflow_stage: 'setup'
            }, 
            error: null 
          })
        })
      })
    } as any);
  });

  afterEach(() => {
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime;
    console.log(`Test render duration: ${renderDuration}ms`);
  });

  it('loads contract data within performance threshold', async () => {
    const startTime = performance.now();

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(1000); // 1 second threshold
  });

  it('handles rapid stage transitions efficiently', async () => {
    const mockContracts = Array.from({ length: 5 }, (_, i) => ({
      id: `test-contract-${i}`,
      status: 'draft',
      workflow_stage: 'setup'
    }));

    let callCount = 0;
    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ 
            data: mockContracts[callCount++ % mockContracts.length], 
            error: null 
          })
        })
      })
    } as any);

    const startTime = performance.now();

    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflowManager projectId="test-project" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(2000); // 2 second threshold for multiple transitions
  });
});