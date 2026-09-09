import { http } from "./http";
import type {
  Book,
  BookDocument,
  CreateBookRequest,
  ChunkGenerationJob,
  ChunkGenerationRequest,
  ExtractedPageText,
  KnowledgeItem,
  SourceChunk
} from "../types/content";

export const contentApi = {
  getKnowledge: (params: {
    language: string;
    levelSystem: string;
    levelCode: string;
    type?: string;
  }) => http.get<KnowledgeItem[]>("/content/knowledge", { params }),
  createBook: (request: CreateBookRequest) => http.post<Book>("/content/books", request),
  getBooks: (params?: {
    language?: string;
    levelSystem?: string;
    levelCode?: string;
  }) => http.get<Book[]>("/content/books", { params }),
  getBook: (bookId: string) => http.get<Book>(`/content/books/${bookId}`),
  uploadDocument: (bookId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<BookDocument>(`/content/books/${bookId}/documents`, formData);
  },
  getDocuments: (bookId: string) => http.get<BookDocument[]>(`/content/books/${bookId}/documents`),
  extractDocument: (documentId: string) => http.post<BookDocument>(`/content/documents/${documentId}/extract`),
  getExtractedPages: (documentId: string) =>
    http.get<ExtractedPageText[]>(`/content/documents/${documentId}/pages`),
  getDocumentChunks: (documentId: string) =>
    http.get<SourceChunk[]>(`/content/documents/${documentId}/chunks`),
  createChunkGenerationJob: (documentId: string, feedback?: string) => {
    const normalizedFeedback = typeof feedback === "string" ? feedback.trim() : "";
    return http.post<ChunkGenerationJob>(
      `/content/documents/${documentId}/chunks/generate`,
      normalizedFeedback ? ({ feedback: normalizedFeedback } satisfies ChunkGenerationRequest) : undefined
    );
  },
  getChunkGenerationJob: (jobId: string) =>
    http.get<ChunkGenerationJob>(`/content/chunk-generation-jobs/${jobId}`),
  retryChunkGenerationJob: (jobId: string) =>
    http.post<ChunkGenerationJob>(`/content/chunk-generation-jobs/${jobId}/retry`),
  approveChunkPlan: (documentId: string) =>
    http.patch<SourceChunk[]>(`/content/documents/${documentId}/chunks/approve`),
  rejectChunkPlan: (documentId: string, reason: string) =>
    http.patch<SourceChunk[]>(`/content/documents/${documentId}/chunks/reject`, { reason })
};
