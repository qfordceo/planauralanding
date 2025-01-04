import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContractWorkflow } from '../contracts/ContractWorkflow';
import { vi } from 'vitest';

const queryClient = new QueryClient();

describe('ContractWorkflow', () => {
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

    await waitFor(() => {
      expect(screen.getByText(/Contract Review/i)).toBeInTheDocument();
    });
  });

  it('handles contract signing flow correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );

    // Progress through workflow
    const createButton = screen.getByText(/Create Contract/i);
    fireEvent.click(createButton);

    await waitFor(() => {
      const reviewButton = screen.getByText(/I Have Reviewed the Terms/i);
      fireEvent.click(reviewButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Sign Contract/i)).toBeInTheDocument();
    });
  });
});