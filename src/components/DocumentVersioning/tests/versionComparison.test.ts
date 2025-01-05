import { compareVersions } from '../utils/versionComparison';
import { DocumentVersion } from '@/types/documents';

describe('versionComparison', () => {
  const mockVersions: DocumentVersion[] = [
    {
      id: '1',
      document_id: 'doc1',
      version_number: 2,
      file_path: '/path/2',
      created_at: new Date().toISOString(),
      created_by: 'user-1',
      metadata: {
        original_name: 'doc-v2.pdf',
        size: 2048,
        type: 'application/pdf'
      }
    },
    {
      id: '2',
      document_id: 'doc1',
      version_number: 1,
      file_path: '/path/1',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      created_by: 'user-1',
      metadata: {
        original_name: 'doc-v1.pdf',
        size: 1024,
        type: 'application/pdf'
      }
    }
  ];

  it('returns correct comparison result', () => {
    const result = compareVersions(mockVersions, 2);

    expect(result.currentVersion).toBeDefined();
    expect(result.previousVersion).toBeDefined();
    expect(result.currentVersion.version_number).toBe(2);
    expect(result.previousVersion?.version_number).toBe(1);
  });

  it('handles case when previous version does not exist', () => {
    const result = compareVersions(mockVersions, 1);

    expect(result.currentVersion).toBeDefined();
    expect(result.previousVersion).toBeNull();
    expect(result.currentVersion.version_number).toBe(1);
  });

  it('throws error when current version is not found', () => {
    expect(() => compareVersions(mockVersions, 3)).toThrow('Current version not found');
  });

  it('returns empty diff when comparing first version', () => {
    const result = compareVersions(mockVersions, 1);

    expect(result.diff).toEqual({
      added: [],
      removed: [],
      modified: []
    });
  });
});