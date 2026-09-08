import React, { useMemo, useState } from 'react';
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  LoaderCircleIcon,
  SearchIcon,
  XIcon } from
'lucide-react';
import type { BookDocument, ExtractedPageText } from '../../types/document';

interface ExtractedTextPreviewProps {
  document: BookDocument;
  pages: ExtractedPageText[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export function ExtractedTextPreview({
  document: bookDocument,
  pages,
  loading,
  error,
  onRetry,
  onClose
}: ExtractedTextPreviewProps) {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visiblePages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
    if (needle === '') return sorted;
    return sorted.filter((page) => page.text.toLowerCase().includes(needle));
  }, [pages, query]);

  const copy = async (page: ExtractedPageText) => {
    try {
      await navigator.clipboard.writeText(page.text);
      setCopiedId(page.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section
      aria-labelledby="preview-title"
      className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
      
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="preview-title" className="font-display text-sm font-bold text-ink">
            Extracted text
          </h2>
          <p className="mt-1 truncate text-xs font-semibold text-ink-soft">
            {bookDocument.originalFileName}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 font-display text-xs font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Close
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="page-search" className="sr-only">
          Search extracted text
        </label>
        <div className="gk-well flex items-center gap-3 rounded-4xl bg-cream-100/90 px-4 py-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            id="page-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search inside the extracted pages…"
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" />
          
        </div>
      </div>

      {loading ?
      <p className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-ink-soft">
          <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading extracted pages…
        </p> :
      error ?
      <div role="alert" className="mt-5 rounded-[1.5rem] bg-peach-100/80 px-5 py-6 text-center">
          <p className="flex items-center justify-center gap-2 font-display text-sm font-bold text-[#a1552c]">
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
          <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-peach-500 px-5 py-2.5 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
          
            Retry
          </button>
        </div> :
      visiblePages.length === 0 ?
      <p className="mt-5 rounded-[1.5rem] bg-cream-100/80 px-5 py-10 text-center text-sm font-semibold text-ink-soft">
          No extracted text found.
        </p> :

      <ul className="mt-4 space-y-3">
          {visiblePages.map((page) =>
        <li key={page.id} className="rounded-[1.5rem] bg-cream-100/85 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 font-display text-[11px] font-bold text-ink">
                  Page {page.pageNumber}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-[#3b6a94]">
                  {page.extractionMethod}
                </span>
                {typeof page.confidence === 'number' ?
            <span className="rounded-full bg-mint-100 px-3 py-1 text-[11px] font-bold text-[#38795c]">
                    Confidence {Math.round(page.confidence * 100)}%
                  </span> :
            null}

                <button
              type="button"
              onClick={() => copy(page)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-display text-[11px] font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
              
                  {copiedId === page.id ?
              <>
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      Copied
                    </> :

              <>
                      <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy
                    </>
              }
                </button>
              </div>

              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-[1.2rem] bg-white/85 px-4 py-3 font-sans text-sm leading-relaxed text-ink">
                {page.text}
              </pre>
            </li>
        )}
        </ul>
      }
    </section>);

}