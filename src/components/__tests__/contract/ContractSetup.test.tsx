import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflow } from '../../contracts/ContractWorkflow';
import { vi } from 'vitest';

const queryClient = new QueryClient();

const mockContract = {
  id: '123',
  project_id: 'test-project',
  status: 'draft',
  workflow_stage: 'setup',
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

describe('Contract Setup Stage', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contract setup when no contract exists', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/Contract Setup/i)).toBeInTheDocument();
  });

  it('shows review step after contract creation', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );

    const createButton = screen.getByText(/Create Contract/i);
    fireEvent.click(createButton);

    await screen.findByText(/Contract Review/i);
  });
});