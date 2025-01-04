import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflow } from '../../contracts/ContractWorkflow';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockContract = {
  id: '123',
  project_id: 'test-project',
  status: 'draft',
  workflow_stage: 'contractor_review',
  content: {
    terms: 'Test terms',
    scope: 'Test scope',
    payment_schedule: 'Test schedule'
  }
};

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

describe('Contract Signing Stage', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onComplete after contract is signed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );

    const signButton = screen.getByText(/Sign Contract/i);
    fireEvent.click(signButton);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });
});