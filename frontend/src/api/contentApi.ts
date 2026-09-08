import { http } from "./http";
import type {
  Book,
  BookDocument,
  CreateBookRequest,
  ExtractedPageText,
  KnowledgeItem
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
  getExtractedPages: (documentId: string) => http.get<ExtractedPageText[]>(`/content/documents/${documentId}/pages`)
};
