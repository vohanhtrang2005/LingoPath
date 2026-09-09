import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircleIcon, ArrowLeftIcon, LoaderCircleIcon, XIcon } from 'lucide-react';
import { UploadPanel, formatBytes } from '../../components/admin/UploadPanel';
import { DocumentsTable } from '../../components/admin/DocumentsTable';
import { ExtractedTextPreview } from '../../components/admin/ExtractedTextPreview';
import { useBookDocuments } from '../../hooks/useBookDocuments';
import { contentApi } from '../../utils/contentApi';
import type { BookDocument, ExtractedPageText } from '../../types/document';

export function AdminBookDocuments() {
  const { bookId = '' } = useParams<{bookId: string;}>();
  const navigate = useNavigate();

  const {
    book,
    bookError,
    bookLoading,
    documents,
    documentsError,
    documentsLoading,
    reloadDocuments,
    extract,
    extractingId
  } = useBookDocuments(bookId);

  const [selected, setSelected] = useState<BookDocument | null>(null);
  const [pages, setPages] = useState<ExtractedPageText[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [pagesError, setPagesError] = useState<string | null>(null);
  const [details, setDetails] = useState<BookDocument | null>(null);
  const [extractNotice, setExtractNotice] = useState<string | null>(null);

  const loadPages = useCallback(async (document: BookDocument) => {
    setSelected(document);
    setPagesLoading(true);
    setPagesError(null);
    try {
      const result = await contentApi.getExtractedPages(document.id);
      setPages(Array.isArray(result) ? result : []);
    } catch {
      setPages([]);
      setPagesError('Could not load extracted pages.');
    } finally {
      setPagesLoading(false);
    }
  }, []);

  const handleExtract = async (documentId: string) => {
    setExtractNotice(null);
    const updated = await extract(documentId);
    if (!updated) {
      setExtractNotice('Extraction request failed. Please try again.');
      return;
    }
    if (updated.status === 'FAILED') {
      setExtractNotice(updated.errorMessage || 'Extraction failed.');
      return;
    }
    if (updated.status === 'EXTRACTED') {
      void loadPages(updated);
    }
  };

  return (
    <main className="min-h-full w-full bg-cream-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate('/admin/books')}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-ink shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to books
        </button>

        {/* Book header */}
        <header className="mt-6">
          {bookLoading ?
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading book…
            </p> :
          bookError ?
          <div
            role="alert"
            className="rounded-[2rem] border border-white/70 bg-white/85 px-6 py-8 text-center">
            
              <p className="flex items-center justify-center gap-2 font-display text-sm font-bold text-[#a1552c]">
                <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
                {bookError}
              </p>
              <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="mt-4 rounded-full bg-peach-500 px-5 py-2.5 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
              
                Back to books
              </button>
            </div> :

          <>
              <p className="font-display text-xs font-bold tracking-[0.18em] text-[#8a5638]">
                LINGOPATH ADMIN · DOCUMENTS
              </p>
              <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight text-ink">
                {book?.name}
              </h1>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                {book?.author ? `by ${book.author}` : 'Author unknown'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-peach-100 px-3 py-1 text-[11px] font-bold text-[#a1552c]">
                  {book?.language}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-[#3b6a94]">
                  {book?.levelSystem}
                </span>
                <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-bold text-ink-soft">
                  {book?.levelCode}
                </span>
                <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                book?.status === 'ACTIVE' ?
                'bg-mint-100 text-[#38795c]' :
                book?.status === 'ARCHIVED' ?
                'bg-cream-200 text-ink-faint' :
                'bg-sky-100 text-[#3b6a94]'}`
                }>
                
                  {book?.status}
                </span>
              </div>
            </>
          }
        </header>

        {!bookError ?
        <>
            <div className="mt-8">
              <UploadPanel bookId={bookId} onUploaded={reloadDocuments} />
            </div>

            {extractNotice ?
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[1.5rem] bg-[#fbe3e3] px-5 py-4 text-sm font-bold text-[#b9524f]">
            
                <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {extractNotice}
                <button
              type="button"
              onClick={() => setExtractNotice(null)}
              aria-label="Dismiss message"
              className="ml-auto rounded-full p-1 text-[#b9524f] transition-colors duration-150 ease-out hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
              
                  <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </p> :
          null}

            <DocumentsTable
            documents={documents}
            loading={documentsLoading}
            error={documentsError}
            extractingId={extractingId}
            selectedId={selected?.id ?? null}
            onRetry={reloadDocuments}
            onExtract={handleExtract}
            onViewText={(document) => void loadPages(document)}
            onDetails={setDetails}
            onViewChunks={(document) =>
            navigate(`/admin/books/${bookId}/documents/${document.id}/chunks`)
            } />
          

            {details ?
          <section
            aria-labelledby="details-title"
            className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
            
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="details-title" className="font-display text-sm font-bold text-ink">
                    Document details
                  </h2>
                  <button
                type="button"
                onClick={() => setDetails(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 font-display text-xs font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                    <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Close
                  </button>
                </div>

                <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
              ['Document ID', details.id],
              ['Book', details.bookName],
              ['Original file', details.originalFileName],
              ['Stored file', details.storedFileName],
              ['Content type', details.contentType || 'unknown'],
              ['File size', formatBytes(details.fileSize)],
              ['Storage path', details.storagePath],
              ['Document type', details.documentType],
              ['Status', details.status],
              ['Error', details.errorMessage || '—']].
              map(([label, value]) =>
              <div key={label} className="rounded-[1.2rem] bg-cream-100/85 px-4 py-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        {label}
                      </dt>
                      <dd className="mt-1 break-all text-sm font-semibold text-ink">{value}</dd>
                    </div>
              )}
                </dl>
              </section> :
          null}

            {selected ?
          <ExtractedTextPreview
            document={selected}
            pages={pages}
            loading={pagesLoading}
            error={pagesError}
            onRetry={() => void loadPages(selected)}
            onClose={() => {
              setSelected(null);
              setPages([]);
              setPagesError(null);
            }} /> :

          null}
          </> :
        null}
      </div>
    </main>);

}