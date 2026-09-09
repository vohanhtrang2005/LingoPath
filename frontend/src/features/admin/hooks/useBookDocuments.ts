import { useCallback, useEffect, useRef, useState } from "react";
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
  const loadSequence = useRef(0);
  const startingExtraction = useRef(false);
  const currentBookId = useRef(bookId);

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

  const loadDocuments = useCallback(async (silent = false) => {
    const sequence = ++loadSequence.current;
    if (!bookId) {
      setDocuments([]);
      setDocumentsError("Book id is missing.");
      setDocumentsLoading(false);
      return;
    }

    if (!silent) setDocumentsLoading(true);
    try {
      const response = await contentApi.getDocuments(bookId);
      if (sequence !== loadSequence.current) return;
      setDocuments(Array.isArray(response.data) ? response.data : []);
      setDocumentsError(null);
    } catch {
      if (sequence === loadSequence.current) {
        setDocumentsError("Could not refresh documents. Retrying shortly.");
      }
    } finally {
      if (sequence === loadSequence.current) setDocumentsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    currentBookId.current = bookId;
    setDocuments([]);
    setExtractingId(null);
    void loadBook();
    void loadDocuments();
    return () => {
      currentBookId.current = "";
      loadSequence.current++;
    };
  }, [bookId, loadBook, loadDocuments]);

  const hasActiveExtraction = extractingId !== null || documents.some(doc => doc.status === "EXTRACTING");

  useEffect(() => {
    if (!hasActiveExtraction && !documentsError) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      await loadDocuments(true);
      if (!cancelled) timer = setTimeout(poll, 5000);
    };
    timer = setTimeout(poll, 5000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hasActiveExtraction, documentsError, loadDocuments]);

  useEffect(() => {
    const refresh = () => { void loadDocuments(true); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [loadDocuments]);

  const extract = useCallback(
    async (documentId: string): Promise<BookDocument | null> => {
      if (startingExtraction.current) return null;
      startingExtraction.current = true;
      setExtractingId(documentId);
      try {
        const response = await contentApi.extractDocument(documentId);
        if (currentBookId.current !== bookId) return null;
        // Invalidate an older poll before publishing the accepted extraction state.
        loadSequence.current++;
        setDocuments(items => items.map(item => item.id === documentId ? response.data : item));
        setDocumentsLoading(false);
        return response.data;
      } catch (error) {
        if (currentBookId.current === bookId) await loadDocuments(true);
        throw error;
      } finally {
        startingExtraction.current = false;
        if (currentBookId.current === bookId) setExtractingId(null);
      }
    },
    [bookId, loadDocuments]
  );

  return {
    book,
    bookError,
    bookLoading,
    documents,
    documentsError,
    documentsLoading,
    reloadBook: loadBook,
    reloadDocuments: () => loadDocuments(),
    extract,
    extractingId
  };
}
