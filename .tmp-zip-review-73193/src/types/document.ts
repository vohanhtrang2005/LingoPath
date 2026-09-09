export type DocumentType = 'PDF' | 'IMAGE' | 'TEXT' | 'DOCX' | 'HTML' | 'AUDIO' | 'UNKNOWN';

export type DocumentStatus = 'UPLOADED' | 'EXTRACTING' | 'EXTRACTED' | 'FAILED';

export type ExtractionMethod =
'PDF_TEXT' |
'PDF_OCR' |
'IMAGE_OCR' |
'TEXT_DIRECT' |
'DOCX_TEXT' |
'HTML_TEXT';

export interface BookDocument {
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
}

export interface ExtractedPageText {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  extractionMethod: ExtractionMethod;
  confidence?: number;
  createdAt?: string;
}

export const ACCEPTED_UPLOAD_TYPES = '.pdf,.txt,.md,.csv,.png,.jpg,.jpeg';
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;