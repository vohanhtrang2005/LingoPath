export type ChunkStatus = 'AI_SUGGESTED' | 'APPROVED' | 'REJECTED';

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  sectionTitle: string | null;
  sectionType: string | null;
  pageFrom: number | null;
  pageTo: number | null;
  startMarker: string | null;
  endMarker: string | null;
  chunkText: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}