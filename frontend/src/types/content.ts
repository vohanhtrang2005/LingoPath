export type KnowledgeItem = {
  id: string;
  language: string;
  levelSystem: string;
  levelCode: string;
  type: string;
  status: string;
  origin?: string;
  confidence?: number;
  contentJson: Record<string, unknown>;
  orderIndex?: number;
  difficulty?: string;
};

export type BookLanguage = "JAPANESE" | "ENGLISH";

export type BookLevelSystem = "JLPT" | "CEFR";

export type BookStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type BookFilters = {
  language: string;
  levelSystem: string;
  levelCode: string;
};

export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const EMPTY_FILTERS: BookFilters = {
  language: "",
  levelSystem: "",
  levelCode: ""
};

export const ACCEPTED_UPLOAD_TYPES = ".pdf,.txt,.md,.csv,.png,.jpg,.jpeg";

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export type Book = {
  id: string;
  name: string;
  author?: string;
  language: BookLanguage;
  levelSystem: BookLevelSystem;
  levelCode: string;
  status: BookStatus;
  createdAt?: string;
};

export type CreateBookRequest = {
  name: string;
  author?: string;
  language: BookLanguage;
  levelSystem: BookLevelSystem;
  levelCode: string;
  status?: BookStatus;
};

export type DocumentType = "PDF" | "IMAGE" | "TEXT" | "DOCX" | "HTML" | "AUDIO" | "UNKNOWN";

export type DocumentStatus = "UPLOADED" | "EXTRACTING" | "EXTRACTED" | "FAILED";

export type ExtractionMethod = "PDF_TEXT" | "PDF_OCR" | "IMAGE_OCR" | "TEXT_DIRECT" | "DOCX_TEXT" | "HTML_TEXT";

export type BookDocument = {
  id: string;
  bookId: string;
  bookName: string;
  originalFileName: string;
  storedFileName: string;
  contentType?: string;
  fileSize: number;
  storagePath: string;
  documentType: DocumentType;
  status: DocumentStatus;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ExtractedPageText = {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  extractionMethod: ExtractionMethod;
  confidence?: number;
  createdAt?: string;
};
