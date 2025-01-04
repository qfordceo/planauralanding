import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflow } from '../../contracts/ContractWorkflow';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockContract = {
  id: '123',
  project_id: 'test-project',
  status: 'draft',
  workflow_stage: 'client_review',
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

describe('Contract Review Stage', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows signature step after review', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );

    const reviewButton = screen.getByText(/I Have Reviewed the Terms/i);
    fireEvent.click(reviewButton);

    await screen.findByText(/Sign Contract/i);
  });
});