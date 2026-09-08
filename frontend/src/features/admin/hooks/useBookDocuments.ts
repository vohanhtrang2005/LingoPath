import { useCallback, useEffect, useState } from "react";
import { contentApi } from "../../../api/contentApi";
import type { Book, BookDocument } from "../../../types/content";

export function useBookDocuments(bookId: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookLoading, setBookLoading] = useState(true);

  const [documents, setDocuments] = useState<BookDocument[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [extractingId, setExtractingId] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    if (!bookId) {
      setBook(null);
      setBookError("Book id is missing.");
      setBookLoading(false);
      return;
    }

    setBookLoading(true);
    setBookError(null);
    try {
      const response = await contentApi.getBook(bookId);
      setBook(response.data);
    } catch {
      setBook(null);
      setBookError("Could not load book.");
    } finally {
      setBookLoading(false);
    }
  }, [bookId]);

  const loadDocuments = useCallback(async () => {
    if (!bookId) {
      setDocuments([]);
      setDocumentsError("Book id is missing.");
      setDocumentsLoading(false);
      return;
    }

    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const response = await contentApi.getDocuments(bookId);
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch {
      setDocuments([]);
      setDocumentsError("Could not load documents.");
    } finally {
      setDocumentsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void loadBook();
    void loadDocuments();
  }, [loadBook, loadDocuments]);

  const extract = useCallback(
    async (documentId: string): Promise<BookDocument | null> => {
      setExtractingId(documentId);
      try {
        const response = await contentApi.extractDocument(documentId);
        await loadDocuments();
        return response.data;
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
