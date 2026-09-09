import type { Book, BookFilters, CreateBookRequest } from '../types/book';
import type { BookDocument, ExtractedPageText } from '../types/document';
import type { DocumentChunk } from '../types/chunk';

const BASE_URL = '/api/content';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function toQuery(params: Partial<BookFilters>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== '') search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const contentApi = {
  getBooks(params: Partial<BookFilters> = {}): Promise<Book[]> {
    return request<Book[]>(`/books${toQuery(params)}`);
  },

  createBook(body: CreateBookRequest): Promise<Book> {
    return request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  getBook(bookId: string): Promise<Book> {
    return request<Book>(`/books/${bookId}`);
  },

  /** Multipart upload — the browser sets the boundary, so no JSON header here. */
  async uploadDocument(bookId: string, file: File): Promise<BookDocument> {
    const body = new FormData();
    body.append('file', file);

    const response = await fetch(`${BASE_URL}/books/${bookId}/documents`, {
      method: 'POST',
      body
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return (await response.json()) as BookDocument;
  },

  getDocuments(bookId: string): Promise<BookDocument[]> {
    return request<BookDocument[]>(`/books/${bookId}/documents`);
  },

  extractDocument(documentId: string): Promise<BookDocument> {
    return request<BookDocument>(`/documents/${documentId}/extract`, { method: 'POST' });
  },

  getExtractedPages(documentId: string): Promise<ExtractedPageText[]> {
    return request<ExtractedPageText[]>(`/documents/${documentId}/pages`);
  },

  getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    return request<DocumentChunk[]>(`/documents/${documentId}/chunks`);
  },

  generateChunkPlan(documentId: string): Promise<DocumentChunk[]> {
    return request<DocumentChunk[]>(`/documents/${documentId}/chunks/plan`, { method: 'POST' });
  },

  approveChunk(documentId: string, chunkId: string): Promise<DocumentChunk> {
    return request<DocumentChunk>(`/documents/${documentId}/chunks/${chunkId}/approve`, {
      method: 'PATCH'
    });
  },

  rejectChunk(documentId: string, chunkId: string): Promise<DocumentChunk> {
    return request<DocumentChunk>(`/documents/${documentId}/chunks/${chunkId}/reject`, {
      method: 'PATCH'
    });
  }
};