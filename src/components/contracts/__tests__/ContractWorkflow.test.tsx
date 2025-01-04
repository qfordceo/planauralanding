import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContractWorkflow } from '../ContractWorkflow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('ContractWorkflow', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('shows signature step after review', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContractWorkflow projectId="test-id" onComplete={mockOnComplete} />
      </QueryClientProvider>
    );

    const reviewButton = screen.getByText(/I Have Reviewed the Terms/i);
    fireEvent.click(reviewButton);

    await waitFor(() => {
      expect(screen.getByText(/Sign Contract/i)).toBeInTheDocument();
    });
  });
});