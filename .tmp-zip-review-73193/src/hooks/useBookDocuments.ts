import { useCallback, useEffect, useState } from 'react';
import { contentApi } from '../utils/contentApi';
import type { Book } from '../types/book';
import type { BookDocument } from '../types/document';

export function useBookDocuments(bookId: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookLoading, setBookLoading] = useState(true);

  const [documents, setDocuments] = useState<BookDocument[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [extractingId, setExtractingId] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    setBookLoading(true);
    setBookError(null);
    try {
      setBook(await contentApi.getBook(bookId));
    } catch {
      setBook(null);
      setBookError('Could not load book.');
    } finally {
      setBookLoading(false);
    }
  }, [bookId]);

  const loadDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const result = await contentApi.getDocuments(bookId);
      setDocuments(Array.isArray(result) ? result : []);
    } catch {
      setDocuments([]);
      setDocumentsError('Could not load documents.');
    } finally {
      setDocumentsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void loadBook();
    void loadDocuments();
  }, [loadBook, loadDocuments]);

  /** Returns the updated document so the caller can react to EXTRACTED / FAILED. */
  const extract = useCallback(
    async (documentId: string): Promise<BookDocument | null> => {
      setExtractingId(documentId);
      try {
        const updated = await contentApi.extractDocument(documentId);
        await loadDocuments();
        return updated;
      } catch {
        await loadDocuments();
        return null;
      } finally {
        setExtractingId(null);
      }
    },
    [loadDocuments]
  );

  return {
    book,
    bookError,
    bookLoading,
    documents,
    documentsError,
    documentsLoading,
    reloadBook: loadBook,
    reloadDocuments: loadDocuments,
    extract,
    extractingId
  };
}