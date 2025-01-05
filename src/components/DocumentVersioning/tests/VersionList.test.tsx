import { render, screen, fireEvent } from '@testing-library/react';
import { VersionList } from '../components/VersionList';
import { DocumentVersion } from '@/types/documents';

const mockVersions: DocumentVersion[] = [
  {
    id: '1',
    document_id: 'doc1',
    version_number: 2,
    file_path: '/path/2',
    created_at: new Date().toISOString(),
    metadata: {
      original_name: 'doc-v2.pdf',
      size: 1024,
      type: 'application/pdf'
    }
  },
  {
    id: '2',
    document_id: 'doc1',
    version_number: 1,
    file_path: '/path/1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    metadata: {
      original_name: 'doc-v1.pdf',
      size: 1024,
      type: 'application/pdf'
    }
  }
];

describe('VersionList', () => {
  const mockOnVersionSelect = vi.fn();

  beforeEach(() => {
    mockOnVersionSelect.mockClear();
  });

  it('renders loading state correctly', () => {
    render(
      <VersionList
        versions={[]}
        currentVersion={1}
        onVersionSelect={mockOnVersionSelect}
        isLoading={true}
      />
    );

    expect(screen.getAllByTestId('version-skeleton')).toHaveLength(3);
  });

  it('renders version list correctly', () => {
    render(
      <VersionList
        versions={mockVersions}
        currentVersion={1}
        onVersionSelect={mockOnVersionSelect}
        isLoading={false}
      />
    );

    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.getByText('v1')).toBeInTheDocument();
  });

  it('calls onVersionSelect when version is clicked', () => {
    render(
      <VersionList
        versions={mockVersions}
        currentVersion={1}
        onVersionSelect={mockOnVersionSelect}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByText('v2'));
    expect(mockOnVersionSelect).toHaveBeenCalledWith(2);
  });

  it('shows correct badges for latest and current versions', () => {
    render(
      <VersionList
        versions={mockVersions}
        currentVersion={1}
        onVersionSelect={mockOnVersionSelect}
        isLoading={false}
      />
    );

    expect(screen.getByText('(Latest)')).toBeInTheDocument();
    expect(screen.getByText('(Current)')).toBeInTheDocument();
  });
});